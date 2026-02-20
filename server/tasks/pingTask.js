const cron = require('node-cron');
const axios = require('axios');

const SERVER_URL = process.env.SERVER_URL;

const keepServerAlive = () => {
  cron.schedule('*/13 * * * *', async () => {
    try {
      await axios.get(`${SERVER_URL}/wof/ping`);
      console.log('Pinged the server to keep it alive');
    } catch (error) {
      console.error('Failed to ping the server', error);
    }
  });
};

module.exports = keepServerAlive;