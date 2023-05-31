# pss-pusher-discord-bot
Post market and chat messages from PSS into Discord. Supports Docker.

Set the following .env variables:
```
DISCORD_TOKEN=#self explanatory
POST_CHAT_TO=#comma separated list of channel ids
POST_MARKET_TO=#comma separated list of channel ids
```

Install dependencies with `pnpm install`.

See `package.json` for scripts to run.

TODO: CI to push to ECR and redeploy
