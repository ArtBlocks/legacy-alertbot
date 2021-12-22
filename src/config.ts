const isProd: boolean = (process.env.NODE_ENV == "production");
const isTest: boolean = (process.env.NODE_ENV == "test");

const stringFromENVorThrow = (value: string, description: string, requiredForDev: boolean) => {
    if (value || (!requiredForDev && !isProd || !isTest)) {
        return value;
    } else {
        throw new Error(`Please specify ${description}`);
    }
}


export const config = {
    twitterApiKey: stringFromENVorThrow(process.env.TWITTER_API_KEY, "twitter access token", false),
    twitterApiSecret: stringFromENVorThrow(process.env.TWITTER_API_SECRET, "twitter access token secret", false),
    twitterOauthToken: stringFromENVorThrow(process.env.TWITTER_OAUTH_TOKEN, "twitter oauth token", false),
    twitterOauthSecret: stringFromENVorThrow(process.env.TWITTER_OAUTH_SECRET, "twitter oauth secret", false),
    infuraId: stringFromENVorThrow(process.env.INFURA_ID, "infura id", true),
    discordWebhookUrl: stringFromENVorThrow(process.env.DISCORD_WEBHOOK_URL, "discord webhook url", false),
}
