import { config } from "dotenv";
config();
import { REST } from 'discord.js';
import { Routes } from 'discord-api-types/v9'; // Use v9 for Discord.js v14

const commands = [
  {
    name: 'attendance',
    description: 'Produces a button menu for attendance',
  },
  {
    name: 'downloadattendance',
    description: 'Downloads PDF of the attendance',
    options: [
      {
        name: 'event',
        type: 'STRING',
        description: 'An optional event message',
        required: false, 
      },
    ],
  }
];

(async () => {
  try {
    const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Successfully registered application commands.');
  } catch (e) {
    console.error(`There was an error: ${e}`);
  }
})();

