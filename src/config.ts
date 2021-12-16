const stringFromENVorThrow = (value: string, description: string) => {
    if (value) {
        return value;
    } else {
        throw new Error(`Please specify ${description}`);
    }
}

export const config = {
    twitterApiKey: stringFromENVorThrow(process.env.TWITTER_API_KEY, "twitter access token"),
    twitterApiSecret: stringFromENVorThrow(process.env.TWITTER_API_SECRET, "twitter access token secret"),
    twitterOauthToken: stringFromENVorThrow(process.env.TWITTER_OAUTH_TOKEN, "twitter oauth token"),
    twitterOauthSecret: stringFromENVorThrow(process.env.TWITTER_OAUTH_SECRET, "twitter oauth secret"),
    infuraId: stringFromENVorThrow(process.env.INFURA_ID, "infura id"),
    discordWebhookUrl: stringFromENVorThrow(process.env.DISCORD_WEBHOOK_URL, "discord webhook url"),
}