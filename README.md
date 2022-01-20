# Art Blocks alertbot

## Overview

A twitter bot that:

- Posts every newly minted Art Block NFT to Twitter (@artblocksmints)
- Posts every newly minted Art Block NFT to Discord in the `artblocks-mints` channel

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
