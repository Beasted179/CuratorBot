// buttonInteractions.js

module.exports = async function handleButtonInteraction(interaction, dbPool) {
    if (
      interaction.customId === "Yes" ||
      interaction.customId === "No" ||
      interaction.customId === "Maybe"
    ) {
      const username = interaction.member.nickname || interaction.user.username;
      const attendanceStatus = interaction.customId;
  
      try {
        const dbClient = await dbPool.connect();
  
        // Define the table name for attendance data
        const tableName = "attendance_data";
  
        // Insert attendance data into the database
        const insertQuery = `
          INSERT INTO ${tableName} (username, attendance_status) VALUES ($1, $2)
        `;
  
        const values = [username, attendanceStatus];
        await dbClient.query(insertQuery, values);
  
        const toUser = `Attendance choice ${attendanceStatus} recorded for ${username}`;
  
        await interaction.reply({
          content: toUser,
          ephemeral: true,
        });
  
        dbClient.release();
      } catch (error) {
        console.error("Error handling interaction:", error);
        // Handle the error and send an error response if needed
        await interaction.reply("An error occurred while processing your request.");
      }
    }
  };
  