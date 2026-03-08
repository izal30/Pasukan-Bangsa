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

  const regex = /videy\.co\/v\?id=([a-zA-Z0-9]+)/g;

  const matches = [...message.content.matchAll(regex)];

  if (matches.length === 0) return;

  let results = [];

  for (const match of matches) {
    const id = match[1];
    results.push(`https://cdn2.videy.co/${id}.mp4`);
  }

  try {

    // hapus pesan asli
    await message.delete();

    // kirim semua hasil
    await message.channel.send(results.join("\n"));

  } catch (error) {
    console.log(error);
  }

});

client.login(TOKEN);
