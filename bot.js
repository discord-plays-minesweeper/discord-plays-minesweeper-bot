require('dotenv').config();
const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const MinesweeperBot = require("./game/Minesweeper")

const jsonfile = require("./config.json");
const DEBUG = process.env.DEBUG;
const basedir = __dirname;
const datadir = path.join(...(DEBUG == "yes" ? [__dirname, ".data-test"] : [__dirname, '..', 'data']));
const guildSettingsPath = path.join(datadir, 'GuildSettings');
const userSettingsPath = path.join(datadir, 'UserSettings');
const creditsPath = path.join(basedir, 'credits.txt');

var config_maxboardx;
var config_maxboardy;
try {
  config_maxboardx = parseInt(process.env.MAXX);
} catch (err) {
  console.error(".env value MAXX is invalid");
  process.exit(1);
}
try {
  config_maxboardy = parseInt(process.env.MAXY);
} catch (err) {
  console.error(".env value MAXY is invalid");
  process.exit(1);
}
const maxBoardX = config_maxboardx;
const maxBoardY = config_maxboardy;

const options = {
  DEBUG,
  jsonfile,
  maxBoardX,
  maxBoardY,
  basedir,
  datadir,
  guildSettingsPath,
  userSettingsPath,
  creditsPath
};


// Make datadir and subfolders
if (!fs.existsSync(datadir)) fs.mkdirSync(datadir);
if (!fs.existsSync(guildSettingsPath)) fs.mkdirSync(guildSettingsPath);
if (!fs.existsSync(userSettingsPath)) fs.mkdirSync(userSettingsPath);

var bot = null;

client.on("ready", () => {
  console.log(`Discord Plays Minesweeper Bot ${jsonfile.version}`);
  console.log("Initializing...");
  bot = new MinesweeperBot(client, options);
  console.log("done");
  console.log("Thanks to ");
  bot.start();
});

client.on("message", message => {
  if (bot == null) return;
  if (message.mentions.has(client.user)) return bot.processPing(message, config);

  // Respond to messages for the server's prefix or the default if the server doesn't have settings or the text channel is in a DM
  var config = bot.getPerServerSettings(message.guild == null ? ("dm-" + message.author.id) : message.guild.id.toString());
  if (message.content.startsWith(config.prefix) && !message.content.startsWith(`${config.prefix} `)) return bot.processCommand(message, config);
});

// login stuffs
client.login(process.env.TOKEN);