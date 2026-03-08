const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST } = require("discord.js");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName("convert")
    .setDescription("Convert Videy link ke CDN")
    .addStringOption(option =>
      option.setName("link")
        .setDescription("Link videy")
        .setRequired(true))
].map(c => c.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: commands }
    );
    console.log("Slash command ready");
  } catch (err) {
    console.log(err);
  }
})();

client.on("ready", () => {
  console.log("Bot online");
});

client.on("interactionCreate", async interaction => {

  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "convert") {

    const link = interaction.options.getString("link");

    const match = link.match(/videy\.co\/v\?id=([a-zA-Z0-9]+)/);

    if (!match) {
      return interaction.reply("Link tidak valid");
    }

    const id = match[1];
    const result = `https://cdn2.videy.co/${id}.mp4`;

    interaction.reply(result);
  }

});

client.login(TOKEN);
