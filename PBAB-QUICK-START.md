# Gain Access to Twitter and Discord APIs

1. Discord - https://discord.com/developers/docs/resources/webhook
2. Twitter - https://developer.twitter.com/en/docs/twitter-api

# Fork

Fork this repo into your organization.

# Adjust Code.

1. Set environment variables https://github.com/ArtBlocks/alertbot/blob/main/.env.example. When ready, we can provide the webhook secret.

# Deploy.

We like using Heroku as it is easy to deploy quickly. If you rather not use heroku, just keep in mind that a redis instance is needed for this to work.

1. Follow this documentation - https://devcenter.heroku.com/articles/git
2. Provision REDIS - https://devcenter.heroku.com/articles/heroku-redis (use hobby level, so you can skip the SSL setup)
3. Set Environment Variables in Heroku console.

# Having trouble?

Please add an issue [here](https://github.com/ArtBlocks/alertbot/issues)
