# pss-pusher-discord-bot

Post market and chat messages from PSS into Discord. Supports Docker.

## Configure

Set the following variables in `./.env`:
```
DISCORD_TOKEN=#self explanatory
POST_CHAT_TO=#comma separated list of channel ids
POST_MARKET_TO=#comma separated list of channel ids
PSS_DEVICE_KEY=#Pixel Starships valid device key with account
```

## Run

Install dependencies with `pnpm install`. 
`package.json` scripts:
 - `build` - compile TypeScript into JavaScript
 - `start` - run compiled JavaScript
 - `dev` - run TypeScript with ts-node
 - `build-docker` - build a docker container (includes .env)
 - `start-docker` - starts the built docker container
 - `sync-s3` - downloads a .env file from s3 (maintainers only)

## CI/CD

- Edit taskdef.json to use your own resources
- In GitHub secrets, set `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` (needs access to ECR and ECS)
- In GitHub variables, set `ECS_CLUSTER`, `ECS_SERVICE`, `AWS_REGION`, `ECS_CONTAINER_NAME` and `ECR_REPOSITORY` (to the names)
- Push to master