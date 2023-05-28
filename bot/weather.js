const axios = require("axios");
const appID = process.env.openapi;
const { User } = require("./models");

const weatherEndpoint = (city) =>
  `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${appID}`;
const forecastEndpoint = (city) =>
  `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${appID}`;
const weatherIcon = (icon) => `http://openweathermap.org/img/w/${icon}.png`;
const weatherHtmlTemplate = (name, main, weather, wind, clouds) =>
  `The weather in <b>${name}</b>:
<b>${weather.main}</b> - ${weather.description}
Temperature: <b>${main.temp} °C</b>
Pressure: <b>${main.pressure} hPa</b>
Humidity: <b>${main.humidity} %</b>
Wind: <b>${wind.speed} meter/sec</b>
Clouds: <b>${clouds.all} %</b>
`;
const getForecast = async (bot,chatId, city) => {
  const endpoint = forecastEndpoint(city);

  try {
    const resp = await axios.get(endpoint);
    const { list } = resp.data;
    const forecastData = list.filter((entry, index) => index % 8 === 0).slice(0, 5);

    const forecastHtml = forecastData
      .map((forecast) => {
        const { dt_txt, main, weather } = forecast;
        const forecastDateTime = new Date(dt_txt);
        const date = forecastDateTime.toDateString();
        const time = forecastDateTime.toLocaleTimeString();
        return `
<b>${date} ${time}</b>
${weather[0].description}
Temperature: <b>${main.temp} °C</b>
Pressure: <b>${main.pressure} hPa</b>
Humidity: <b>${main.humidity} %</b>
-------------------
`;
      })
      .join("\n");

    bot.sendMessage(chatId, forecastHtml, { parse_mode: "HTML" });
  } catch (error) {
    console.log("error", error);
    bot.sendMessage(
      chatId,
      `Ooops...I couldn't be able to get forecast for <b>${city}</b>`,
      { parse_mode: "HTML" }
    );
  }
};
const getWeather = async (bot,chatId, city) => {
  const endpoint = weatherEndpoint(city);

  try {
    const resp = await axios.get(endpoint);
    const { name, main, weather, wind, clouds } = resp.data;
    const lowerCaseCity = city.toLowerCase();
    const user = await User.findOne({ id: chatId });
    if (user && user.location.includes(lowerCaseCity)) {
    } else {
      await User.updateOne(
        { id: chatId },
        { $addToSet: { location: lowerCaseCity } }
      );
    }
    bot.sendPhoto(chatId, weatherIcon(weather[0].icon));
    bot.sendMessage(
      chatId,
      weatherHtmlTemplate(name, main, weather[0], wind, clouds),
      { parse_mode: "HTML" }
    );
  } catch (error) {
    console.log("error", error);
    bot.sendMessage(
      chatId,
      `Ooops...I couldn't be able to get weather for <b>${city}</b>`,
      { parse_mode: "HTML" }
    );
  }
};
const sendWeatherUpdates = async () => {
  try {
    const users = await User.find({ subscribed: true, blocked: false });
    for (const user of users) {
      const { id, location } = user;
      for (const city of location) {
        getWeather(id, city);
        getForecast(id,city)
      }
    }
  } catch (error) {
    console.error("Error sending weather updates:", error);
  }
};
module.exports = {
  getForecast,
  getWeather,
  sendWeatherUpdates,
};