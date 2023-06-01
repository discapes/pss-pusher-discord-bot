import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import { config as dotenv } from "dotenv";
import { createWriteStream } from "fs";
import { initializePusher, libConfig } from "./lib.js";

dotenv();

const formatDate = (d: Date) => `${d.toISOString().slice(0, "2023-03-06".length)
} ${d.getUTCHours().toString().padStart(2, "0")
}:${d.getUTCMinutes().toString().padStart(2, "0")}`;

const logStream = createWriteStream("log.txt", { flags: "a" });

function log(data: string, o?: {}) {
	logStream.write(`${formatDate(new Date())}: ${data}${o !== undefined ? JSON.stringify(o, null, 2) : ""}\n`);
}

libConfig.logger = log;

const TOKEN = process.env.DISCORD_TOKEN;

console.log("Starting Pusher bot");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", async () => {
	log(`Logged in as ${client.user?.tag}!`);
});

await client.login(TOKEN);

if (!process.env.POST_CHAT_TO) throw new Error("POST_CHAT_TO is undefined");
if (!process.env.POST_MARKET_TO) throw new Error("POST_MARKET_TO is undefined");

const publicChannels = <TextChannel[]>(await Promise.all(process.env.POST_CHAT_TO.split(",").flatMap((c) => client.channels.fetch(c))));
const marketChannels = <TextChannel[]>(await Promise.all(process.env.POST_MARKET_TO.split(",").flatMap((c) => client.channels.fetch(c))));

const pusher = await initializePusher(log);

pusher.subscribe("public-en");
pusher.subscribe("market");
pusher.bind("message", (msg: any) => {
	const dateString = formatDate(new Date());
	switch (msg.MessageType) {
	case "Market":
		marketChannels.map((c) => c.send(
			`${dateString} - \`${msg.UserName}\` ${(<string>msg.Message).replace("在卖", "Selling")
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

await new Promise(() => undefined);
