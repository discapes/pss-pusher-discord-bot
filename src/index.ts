import { log } from "console";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import { config as dotenv } from "dotenv";
import { initializePusher, libConfig } from "./pss-api/index.js";
import { formatTime, logToFile } from "./util.js";

dotenv();

if (!process.env.POST_CHAT_TO) throw new Error("POST_CHAT_TO is undefined");
if (!process.env.POST_MARKET_TO) throw new Error("POST_MARKET_TO is undefined");
if (!process.env.DISCORD_TOKEN) throw new Error("DISCORD_TOKEN is undefined");
if (!process.env.PSS_DEVICE_KEY) throw new Error("PSS_DEVICE_KEY is undefined");

log("Starting pss-pusher-discord-bot");




const discord = new Client({ intents: [GatewayIntentBits.Guilds] });
discord.on("ready", async () => {
	log(`Logged in as ${discord.user?.tag}!`);
});

await discord.login(process.env.DISCORD_TOKEN);

const publicChannels = <TextChannel[]>(await Promise.all(process.env.POST_CHAT_TO.split(",").flatMap((c) => discord.channels.fetch(c))));
const marketChannels = <TextChannel[]>(await Promise.all(process.env.POST_MARKET_TO.split(",").flatMap((c) => discord.channels.fetch(c))));






libConfig.logger = logToFile;
const pusher = await initializePusher(process.env.PSS_DEVICE_KEY);

pusher.subscribe("public-en");
pusher.subscribe("market");
pusher.bind("message", (msg: any) => {
	const timestamp = formatTime(new Date());
	switch (msg.MessageType) {
	case "Market":
		marketChannels.map((c) => c.send(
			`${timestamp} - \`${msg.UserName}\` ${(<string>msg.Message).replace("在卖", "Selling")
				.replace("販売", "Selling")
				.replace("판매 중", "Selling")
				.replace("正在出售", "Bought")
				.replace("Продает", "Selling")
				.replace("Selling", "is selling")
				.toLowerCase()} for ${msg.ActivityArgument.split(":")[1]} ${msg.ActivityArgument.split(":")[0]}`,
		));
		break;
	default:
		publicChannels.map((c) => c.send(`${msg.UserName}: ${msg.Message}`));
	}
});
