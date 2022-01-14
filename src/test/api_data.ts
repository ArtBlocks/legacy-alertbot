import { getArtblockInfo, getOpenseaInfo } from "../api_data";
var assert = require("assert");
const nock = require("nock");
process.env.NODE_ENV = 'test';
process.env.THUMBNAIL_LOCATION = "https://artblocks-mainthumb.s3.amazonaws.com"

describe("api_data", () => {
  describe("#getArtblockInfo", () => {
    before(() => {
      if (!nock.isActive()) nock.activate();
      const tokenScope = nock("https://token.artblocks.io")
        .get("/1")
        .reply(200, {
          name: "Recursion #1",
          image: "https://media.artblocks.io/1.png",
          external_url: "https://www.artblocks.io/token/1",
        });
      const imgScope = nock("https://artblocks-mainthumb.s3.amazonaws.com")
        .get("/1")
        .reply(200, {
          data: new ArrayBuffer(8),
        });
      tokenScope;
      imgScope;
    });
    afterEach(nock.cleanAll);
    it("gets additional meta needed for alert", async () => {
      const { name, image, external_url, imgBinary } = await getArtblockInfo(
        "1"
      );
      assert.equal(name, "Recursion #1");
      assert.equal(image, "https://media.artblocks.io/1.png");
      assert.equal(external_url, "https://www.artblocks.io/token/1");
      const buffer = Buffer.isBuffer(imgBinary);
      assert.equal(buffer, true);
    });
  });
  describe("#getOpenseaInfo", () => {
    const account = "0x104e1e2725dbbd2d75eb1a46e880932d2e1d4c12";
    before(() => {
      const openSeaScope = nock("https://api.opensea.io")
        .get(`/account/${account}/`)
        .reply(200, { data: { user: { username: "ABKING123" } } });
      openSeaScope;
    });
    it("gets owner data for alert", async () => {
      const mintedBy = await getOpenseaInfo(account);
      assert.equal(mintedBy, "ABKING123");
    });
  });
});
