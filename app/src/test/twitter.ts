import { sendToTwitter } from "../twitter";
import axios from "axios";

var assert = require("assert");
const nock = require("nock");

axios.defaults.adapter = require("axios/lib/adapters/http");

describe("twitter", () => {
  const ab: any = {
    name: "Recursion #1",
    image: "https://media.artblocks.io/1.png",
    external_url: "https://www.artblocks.io/token/1",
    mintedBy: "ABKING123",
    imgBinary: Buffer.from(new ArrayBuffer(8)),
  };
  const contractVersion = "v2";
  describe("#sendToTwitter", () => {
    afterEach(nock.cleanAll);
    it("sends twitter notification", async () => {
      if (!nock.isActive()) nock.activate();
      const twitterScope = nock("https://upload.twitter.com")
        .post("/1.1/media/upload.json", (body: any) => true)
        .reply(200, { tweetUrl: "" });
      twitterScope;
      const resp = await sendToTwitter(ab, contractVersion);
    });
  });
});
