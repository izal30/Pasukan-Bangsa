const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const cooldown = new Map();
const COOLDOWN_TIME = 3000;

client.once("clientReady", () => {
  console.log(`Bot aktif sebagai ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  const userId = message.author.id;
  const now = Date.now();

  if (cooldown.has(userId)) {
    const expiration = cooldown.get(userId) + COOLDOWN_TIME;

    if (now < expiration) {
      return;
    }
  }

  const regex = /videy\.co\/v\?id=([a-zA-Z0-9]+)/g;
  const matches = [...message.content.matchAll(regex)];

  if (matches.length === 0) return;

  cooldown.set(userId, now);

  let results = [];

  for (let i = 0; i < matches.length && i < 5; i++) {
    const id = matches[i][1];
    results.push(`https://cdn2.videy.co/${id}.mp4`);
  }

  const output = results.join("\n");

  try {
    await message.delete();
  } catch (err) {
    console.log("Tidak bisa hapus pesan");
  }

  try {
    await message.channel.send(output);
  } catch (err) {
    console.log("Gagal kirim pesan:", err);
  }

});

client.login(process.env.TOKEN);
