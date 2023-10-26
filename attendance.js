process.noDeprecation = true;
import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder, 
  ComponentType,
} from "discord.js";

import {dbClient} from "./Client.js";
//import{ handleuserinput }from"./curatorBrain.js";
import * as fs from "fs" ;
import { config } from "dotenv";
config();
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});


// The rest of your bot initialization code, including the "ready" event handler
client.once("ready", () => {
  console.log("Ready!");
});

client.on("messageCreate", async (message) => {
  return;
  //if (message.author.bot) return;
  // if (message.mentions.has(client.user)) {
  //   const messageContent = message.content;
  //   // Remove user mentions and bot mentions
  //   const withoutMentions = messageContent.replace(/<@!\d+>|<@\d+>/g, '');

  //   // Trim any leading or trailing spaces
  //   const trimmedContent = withoutMentions.trim();
  //   const formattedMessage = `${message.member.nickname}: ${trimmedContent}`;
  //       const chatGPTResponse = await handleuserinput(formattedMessage);
  //   await message.reply(chatGPTResponse);
  // }
});

client.on("interactionCreate", async (interaction) => {
  
  if (interaction.commandName === "attendance") {
    const yes = new ButtonBuilder()
      .setCustomId("Yes")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success);
  
    const no = new ButtonBuilder()
      .setCustomId("No")
      .setLabel("No")
      .setStyle(ButtonStyle.Danger);
  
    const maybe = new ButtonBuilder()
      .setCustomId("Maybe")
      .setLabel("Maybe")
      .setStyle(ButtonStyle.Primary);
  
    const row = new ActionRowBuilder().addComponents(yes, no, maybe);
  
    const response = await interaction.reply({
      content: interaction.options.getString("event") || " ",
      components: [row],
    });
  } else if (interaction.commandName === "downloadattendance"  ) {
    if(!interaction.member.roles.cache.some(role => role.name === "Admin")) {
      await interaction.reply({ 
        content: "You do not have permission to use this command.", 
        ephemeral: true });
        return;
    } 
    try {
      
      // Query to retrieve attendance data (customize as needed)
      const query = 'SELECT username, attendance_status FROM attendance_data';
  
      const result = await dbClient.query(query);
  
     
      const textContent = result.rows.map(row => `${row.username}: ${row.attendance_status}`).join('\n');
  
  
      const fileName = 'attendance.txt';
  
    
      const attachment = new AttachmentBuilder()
        .setFile(Buffer.from(textContent, 'utf-8'))
        .setDescription('Members Attendance Roster')
        .setName(fileName)
        .setSpoiler(false);
  
  
      await interaction.reply({
        content: "Here is the attendance roster:",
        files: [attachment],
        ephemeral: true, // Optional: Make the response ephemeral
      }); 
      console.log(interaction.options)
      if (interaction.options.getBoolean("delete")) {
        await dbClient.query('DELETE FROM attendance_data');
        await interaction.followUp({
          content: "Attendance roster deleted",
          ephemeral: true,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } 
  

} else if(interaction.isButton()){
  console.log(interaction, "this is the interaction");
  if (interaction.customId === "Yes" || interaction.customId === "No" || interaction.customId === "Maybe") {
    const username = interaction.member.nickname;
    console.log(username);
    let attendanceStatus = interaction.customId;
    console.log(attendanceStatus);
    try {
      console.log('Connected to PostgreSQL database');

      // Define the table name for attendance data
      const tableName = 'attendance_data';

      // Create the table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id serial PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          attendance_status VARCHAR(10) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `;
      await dbClient.query(createTableQuery);

      let toUser;

      // Insert attendance data into the database
      const insertQuery = `
        INSERT INTO ${tableName} (username, attendance_status) VALUES ($1, $2)
      `;
      const values = [username, attendanceStatus];
      await dbClient.query(insertQuery, values);

      toUser = `Attendance choice ${attendanceStatus} recorded for ${username}`;

      await interaction.reply({
        content: toUser,
        ephemeral: true,
      });
      await dbClient.release();
    } catch (error) {
      console.error('Error handling interaction:', error);
      // Handle the error and send an error response if needed
      interaction.reply('An error occurred while processing your request.');
    }
  }
}


});



client.login(process.env.BOT_TOKEN);
