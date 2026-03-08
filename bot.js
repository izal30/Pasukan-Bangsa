const { Client, GatewayIntentBits } = require("discord.js");

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log(`Bot aktif sebagai ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  const regex = /videy\.co\/v\?id=([a-zA-Z0-9]+)/;

  const match = message.content.match(regex);

  if (!match) return;

  const id = match[1];

  const cdn = `https://cdn2.videy.co/${id}.mp4`;

  message.reply(cdn);

});

client.login(TOKEN);
