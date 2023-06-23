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
        switch (msg.MessageType) {
        case "Market":
                const formatted = formatMarketMessage(msg);
                marketChannels.map((c) => c.send(formatted));
                break;
        default:
                publicChannels.map((c) => c.send(`${msg.UserName}: ${msg.Message}`));
        }
});


function formatMarketMessage(msg: any) {
        const timestamp = formatTime(new Date());
        const action = msg.Message.replace(/.*? (\d)/, msg.ActivityType.replace("MarketListed", "is selling").replace("MarketSold", "bought") + ' $1');
        const price = msg.ActivityArgument.split(":").reverse().join(" ");
        return `${timestamp} - \`${msg.UserName}\` ${action} for ${price}`;
}
