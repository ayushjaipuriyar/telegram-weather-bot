const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const { User } = require("./models");
const { getForecast, getWeather } = require("./weather");
const { reverseGeo } = require("./location");
const { startCronJobs } = require("./cron-jobs");

const mongoURL = process.env.mongo;
const mongoClient = new MongoClient(mongoURL);
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "bot",
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const token = process.env.token;

const bot = new TelegramBot(token, {
  polling: true,
});

bot.on("polling_error", (msg) => console.log(msg));
startCronJobs();
bot.onText(/\/weather/, (msg) => {
  const chatId = msg.chat.id;
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Grant Location",
            callback_data: "grantLocation",
          },
        ],
        [
          {
            text: "City Name",

            callback_data: "getName",
          },
        ],
      ],
    },
  };
  bot.sendMessage(chatId, "How would you like to get the weather?", opts);
});
bot.onText(/getLocation/, (msg) => {
  const opts = {
    reply_to_message_id: msg.message_id,
    reply_markup: JSON.stringify({
      keyboard: [[{ text: "Location", request_location: true }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    }),
  };
  bot.sendMessage(msg.chat.id, "Location request", opts);
});

bot.on("callback_query", function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    reply_to_message_id: msg.message_id,
    message_id: msg.message_id,
  };

  if (action === "grantLocation") {
    const locationOpts = {
      reply_to_message_id: msg.message_id,
      reply_markup: JSON.stringify({
        keyboard: [[{ text: "Location", request_location: true }]],
        resize_keyboard: true,
        one_time_keyboard: true,
      }),
    };
    bot.sendMessage(msg.chat.id, "Please share your location.", locationOpts);
  } else if (action === "getName") {
    bot.once("message", (nextMsg) => {
      const city = nextMsg.text;
      getWeather(bot, msg.chat.id, city);
      getForecast(bot, msg.chat.id, city);
    });
    bot.sendMessage(msg.chat.id, "Please enter the city name.");
  }
});

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `Welcome at <b>MyTestWeatherInfoBot</b>, thank you for using my service
    
Available commands:

/weather <b>city</b> - shows weather for selected <b>city</b>
  `,
    {
      parse_mode: "HTML",
    }
  );
});

bot.on("location", (msg) => {
  const chatId = msg.chat.id;
  const lon = msg.location.longitude;
  const lat = msg.location.latitude;
  reverseGeo(bot, chatId, lon, lat);
});

bot.onText(/\/subscribe/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const user = await User.findOne({ id: chatId });

    if (user) {
      if (user.subscribed) {
        bot.sendMessage(chatId, "You are already subscribed");
      } else {
        await User.updateOne({ id: chatId }, { $set: { subscribed: true } });
        bot.sendMessage(chatId, "You are now subscribed");
      }
    } else {
      const newUser = new User({
        id: chatId,
        first_name: msg.chat.first_name,
        last_name: msg.chat.last_name,
        username: msg.chat.username,
        type: msg.chat.type,
        subscribed: true,
        blocked: false,
      });

      await newUser.save();
      bot.sendMessage(chatId, "You are now subscribed");
    }
  } catch (error) {
    console.error("Error saving user:", error);
  }
});

bot.onText(/\/unsubscribe/, (msg) => {
  const chatId = msg.chat.id;
  db.collection("users").updateOne(
    { id: msg.chat.id },
    { $set: { subscribed: false } },
    (err) => {
      if (err) {
        console.error("Error updating subscription status:", err);
        return;
      }
      bot.sendMessage(chatId, "You have unsubscribed");
    }
  );
});
