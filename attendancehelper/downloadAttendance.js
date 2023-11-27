// downloadAttendanceCommand.js
const { AttachmentBuilder } = require('./builders'); // Import your attachment builder

module.exports = async function handleDownloadAttendanceCommand(interaction, dbPool) {
  if (!interaction.member.roles.cache.some((role) => role.name === "Admin")) {
    await interaction.reply({
      content: "You do not have permission to use this command.",
      ephemeral: true,
    });
    return;
  }

  try {
    // Query to retrieve attendance data (customize as needed)
    const query = "SELECT username, attendance_status FROM attendance_data";

    const dbClient = await dbPool.connect();

    const result = await dbClient.query(query);

    const textContent = result.rows
      .map((row) => `${row.username}: ${row.attendance_status}`)
      .join("\n");

    const fileName = "attendance.txt";

    const attachment = new AttachmentBuilder()
      .setFile(Buffer.from(textContent, "utf-8"))
      .setDescription("Members Attendance Roster")
      .setName(fileName)
      .setSpoiler(false);

    await interaction.reply({
      content: "Here is the attendance roster:",
      files: [attachment],
      ephemeral: true, // Optional: Make the response ephemeral
    });

    if (interaction.options.getBoolean("delete")) {
      await dbClient.query("DELETE FROM attendance_data");
      await interaction.followUp({
        content: "Attendance roster deleted",
        ephemeral: true,
      });
    }

    dbClient.release();
  } catch (error) {
    console.error("Error:", error);
    // Handle the error and send an error response if needed
    await interaction.reply("An error occurred while processing your request.");
  }
};
