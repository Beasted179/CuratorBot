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
import {buttonInteractions, buttonMaker, downloadattendance} from "./attendancehelper";
import { dbPool } from "./Client.js";
//import{ handleuserinput }from"./curatorBrain.js";
import * as fs from "fs";
import { config } from "dotenv";
config();
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
const { dbPool } = require('./dbClient'); // Import the dbClient

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand() && !interaction.isButton()) return;

  if (interaction.isCommand()) {
    if (interaction.commandName === 'attendance') {
      await buttonMaker(interaction, dbPool);
    } else if (interaction.commandName === 'downloadattendance') {
      await downloadattendance(interaction, dbPool);
    }
  } else if (interaction.isButton()) {
    await buttonInteractions(interaction, dbPool);
  }
});


client.login(process.env.BOT_TOKEN);
