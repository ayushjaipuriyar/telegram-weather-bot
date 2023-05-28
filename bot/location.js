const axios = require("axios");
const { getForecast, getWeather } = require("./weather");

const appID = process.env.openapi;
const reverseGeo = async (bot,chatId, lon, lat) => {
    const endpoint = `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=${appID}`;
  
    try {
      const resp = await axios.get(endpoint);
      const city = resp.data[0].name;
      getWeather(bot,chatId, city);
      getForecast(bot,chatId, city);
    } catch (error) {
      console.log("error", error);
      bot.sendMessage(
        chatId,
        `Ooops...I couldn't be able to get city for <b>${lat} & ${lon}</b>`,
        { parse_mode: "HTML" }
      );
    }
  };
  module.exports = {
    reverseGeo,
  };