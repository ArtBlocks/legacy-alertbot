const dotEnvPath = process.env.DOTENV_PATH;
if (!dotEnvPath) {
    throw new Error('No dotenv path required, please specify via DOTENV_PATH env var');
}
require('dotenv').config({ path: dotEnvPath });


const stringFromENVorThrow = (value: string, description: string) => {
    if (value) {
        return value;
    } else {
        throw new Error(`Please specify ${description}`);
    }
}

export const config = {
    twitterApiKey: stringFromENVorThrow(process.env.TWITTER_API_KEY, "twitter api key"),
    twitterApiSecret: stringFromENVorThrow(process.env.TWITTER_API_SECRET, "twitter api secret"),
}