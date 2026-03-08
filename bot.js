const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const cooldown = new Map();
const delay = 3000;

client.once("clientReady", () => {
  console.log("Bot sudah online");
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  const userId = message.author.id;
  const now = Date.now();

  if (cooldown.has(userId)) {
    if (now - cooldown.get(userId) < delay) {
      return;
    }
  }

  const regex = /videy\.co\/v\?id=([a-zA-Z0-9]+)/g;
  const matches = [...message.content.matchAll(regex)];

  if (!matches.length) return;

  cooldown.set(userId, now);

  let links = [];

  for (let i = 0; i < matches.length && i < 5; i++) {
    const id = matches[i][1];
    links.push(`https://cdn2.videy.co/${id}.mp4`);
  }

  try {
    await message.delete().catch(() => {});
    await message.channel.send(links.join("\n"));
  } catch (err) {
    console.log(err);
  }

});

client.login(process.env.TOKEN);
