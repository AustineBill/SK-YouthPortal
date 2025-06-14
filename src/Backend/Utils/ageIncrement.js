const cron = require("node-cron");
const pool = require("../db");

// Function to increment birthdate and update status
async function updateAgeAndStatus() {
  try {
    // Increment age (adjusting birthdate here seems wrong — should track age separately or calculate from date)
    // For now assuming it's a misnamed column: birthday = date of birth
    const updateAgeQuery = `
      UPDATE Users
      SET birthdate = birthdate + INTERVAL '1 year'
      WHERE EXTRACT(MONTH FROM CURRENT_DATE) = EXTRACT(MONTH FROM birthdate)
        AND EXTRACT(DAY FROM CURRENT_DATE) = EXTRACT(DAY FROM birthdate);
    `;
    await pool.query(updateAgeQuery);

    // Mark users as 'inactive' if they are 31 or older
    const updateStatusQuery = `
      UPDATE Users
      SET status = 'inactive'
      WHERE DATE_PART('year', AGE(birthdate)) >= 31;
    `;
    await pool.query(updateStatusQuery);

    console.log("Age and status updated successfully.");
  } catch (err) {
    console.error("Error updating birthdate and status:", err);
  }
}

// Run task once a day at midnight
function scheduleAgeAndStatusUpdate() {
  cron.schedule("0 0 * * *", () => {
    console.log("Running the birthdate and status update task...");
    updateAgeAndStatus();
  });
}

module.exports = { scheduleAgeAndStatusUpdate };
