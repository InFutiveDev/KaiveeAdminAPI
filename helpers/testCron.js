var cron = require('node-cron');
const { testUpdate } = require('./testUpdate');

//Running a task every night at 1:00 AM
cron.schedule('0 1 * * *', async () => {
  console.log('Running a task every night at 1:00 AM')
  console.log('Cron Prosess Start....');
    await testUpdate();
  console.log('Cron Prosess End....');
});

// Every Minute
// cron.schedule('* * * * *', async () => {
//   console.log('Cron Prosess Start....');
//     await testUpdate();
//   console.log('Cron Prosess End....');
// });