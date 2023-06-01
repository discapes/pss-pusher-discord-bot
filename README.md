# pss-pusher-discord-bot
Post market and chat messages from PSS into Discord. Supports Docker.

Set the following .env variables:
```
DISCORD_TOKEN=#self explanatory
POST_CHAT_TO=#comma separated list of channel ids
POST_MARKET_TO=#comma separated list of channel ids
PSS_DEVICE_KEY=#Pixel Starships valid device key with account
```

Install dependencies with `pnpm install`.

See `package.json` for scripts to run.

