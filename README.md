# Art Blocks alertbot

## Overview

A twitter bot that:

- Posts every newly minted Art Block NFT to Twitter (@artblocksmints)
- Posts every newly minted Art Block NFT to Discord in the `artblocks-mints` channel

## Deployment

Alertbot is deployed automatically to Heroku every push to `main` via Heroku's GitHub integration.

Currently, the ability to run the bot locally is not configured (see Issue #15).  

## Running Locally

>Curently, alertbot is not very well sandboxed. This means the bot will post to production Twitter and Discord when running locally. It is therefore not recommended to run the bot locally unless you know what you are doing.

>Ideally, dev twitter and discord bots can be set up for this in the future.

To run locally:
- ensure local `.env` file is populated as desired
- spin up a redis instance (default port recommended `localhost:6379`)
- run `yarn start`