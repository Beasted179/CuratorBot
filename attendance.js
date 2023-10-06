process.noDeprecation = true;
import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder, 
} from "discord.js";
import{ handleuserinput }from"./curatorBrain.js";
import * as fs from "fs" ;
import { config } from "dotenv";
config();
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.mentions.has(client.user)) {
    const messageContent = message.content;
    // Remove user mentions and bot mentions
    const withoutMentions = messageContent.replace(/<@!\d+>|<@\d+>/g, '');

    // Trim any leading or trailing spaces
    const trimmedContent = withoutMentions.trim();
    const formattedMessage = `${message.member.nickname}: ${trimmedContent}`;
        const chatGPTResponse = await handleuserinput(formattedMessage);
    await message.reply(chatGPTResponse);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
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
    console.log(interaction.options)
    if(!interaction.options.getString("event")) { 
    await interaction.reply({
      components: [row],
    })
  } else {
    await interaction.reply({
      content: interaction.options.getString("event"),
      components: [row],
    });
  }
    // Define a collector to listen for button interactions
    const collector = interaction.channel.createMessageComponentCollector({
      filter: (interaction) =>
        ["Yes", "No", "Maybe"].includes(
          interaction.customId
        ) && interaction.isButton(),
    });

    collector.on("collect", async (interaction) => {
      const username = interaction.member.nickname;
      console.log(username)
      let attendanceStatus = interaction.customId
      console.log(attendanceStatus)

      let toUser;
      if (attendanceStatus === "No") {
        let response = `${username}\tNo\n`
        fs.appendFileSync('./attendance.txt', response, 'utf-8'),
          toUser = `Alright ${username}no hard feelings see ya !`;
      } else if (attendanceStatus === "Yes") {
        let response = `${username}\tYes\n`
        fs.appendFileSync('./attendance.txt', response, 'utf-8'),
         toUser =`Alright ${username} see you there !`;
      } else if (attendanceStatus === "Maybe") {
        let response = `${username}\tMaybe\n`
        fs.appendFileSync('./attendance.txt', response, 'utf-8'),
          toUser =`Alright ${username} hope to see you there !`;
      } else { 
        return;
}
await interaction.reply({
  content: toUser,
  ephemeral: true,
});

});

}
if (interaction.commandName === "downloadattendance" && interaction.member.roles.cache.some(role => role.name === "Admin")) {
  console.log("it recognized the command")
  const attachment = new AttachmentBuilder()
    .setFile('./attendance.txt')
    .setDescription('Members Attendance Roster')
    .setName('attendance.txt')
    .setSpoiler(false);

  try {
    await interaction.reply({
      content: "Here is the attendance roster",
      files: [attachment],
      ephemeral: true, // Optional: Make the response ephemeral
    });
    
    // Clear the contents of the file
    fs.writeFileSync('./attendance.txt'," ",'utf-8');
  } catch (error) {
    console.log(error)
  }
}

});



client.login(process.env.BOT_TOKEN);
