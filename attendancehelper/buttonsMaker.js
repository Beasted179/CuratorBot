// attendanceCommand.js
const { ButtonBuilder, ActionRowBuilder } = require('./builders'); // Import your button builders

module.exports = async function handleAttendanceCommand(interaction, dbPool) {
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
};
