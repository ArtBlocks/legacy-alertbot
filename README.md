# Art Blocks alertbot

### **NOTE: This repo has been deprecated in favor of [artbot](https://github.com/ArtBlocks/artbot), which now handles all mint posting responsibilities**

## Overview

A twitter bot that:

- Posts every newly minted Art Block NFT[^1] to Twitter (@artblocksmints)
- Posts every newly minted Art Block NFT[^1] to Discord in the `artblocks-mints` channel

## Deployment

Alertbot is deployed automatically to Heroku every push to `main` via Heroku's GitHub integration.

## Supporting Your PBAB Project

Are you a PBAB partner? Alertbot is readily forkable to support your project! [Start Here!](https://github.com/ArtBlocks/alertbot/blob/pbab-readme/PBAB-QUICK-START.md)

Shoot us a message in Discord and we can help you with getting things wired up :)

## Running Locally

>Curently, alertbot does not have sandboxed twitter and discord bots set up. For now, it has logic that only posts to production if an env variable NODE_ENV is set to `"production"`. This is true on the production heroku instance running the bot, but shouldn't be set in a local .env file. Logs are displayed when running locally to indicate that the bot **would** have posted to twitter and discord.

To run locally:
- ensure local `.env` file is populated using template in `.env.example` (no prod env vars required)
- spin up a redis instance (default port recommended `localhost:6379`)
  - reminder: you can always delete all keys from Redis database via `redis-cli flushall`
- run `yarn start`

## Deleting Tweets
Accidental tweets may be deleted via Twitter's api by running the following script:
>note: `.env.prod` must be populated with production twitter api keys and auth
```
yarn delete-tweet <tweet-id>
```

[^1]: Mint #0 for a new project will always be skipped by alertbot in the interest of preventing broken links, as mint #0 is usually performed before a project has been activated, in which case the Generator API for that project will not yet be publicly accessible in the interest of maintaining some artist privacy for accessing this data outside of direct contract calls during the development process. If you are a PBAB partner and would like to modify this behavior for your alertbot integration, please reach out! :)
