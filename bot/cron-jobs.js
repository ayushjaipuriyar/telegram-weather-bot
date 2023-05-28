const cron = require("node-cron");
const { sendWeatherUpdates } = require("./weather");
const cronSchedule = "* 9 * * *"; 


  const startCronJobs = () => {
  cron.schedule(cronSchedule, () => {
    sendWeatherUpdates();
  });
  }

  module.exports = {
    startCronJobs,
  };