const cron = require("node-cron");
const sendNewsletter = require("../utils/sendNewsletter");

cron.schedule("17 14 * * *", async() => {
  console.log("🕘 Running newsletter job at 9:00 AM");
  await sendNewsletter();
});
sendNewsletter();
