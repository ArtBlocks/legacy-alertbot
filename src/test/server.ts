import { webhookData } from "./mocks/webhook";
import { mintQueue } from "../mint_queue"

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('/ receives hasura webhook', () => {
  it('it should add the token to the queue', (done) => {
    chai.request(app)
        .post('/')
        .send(webhookData)
        .end((err: any, res: any) => {
          res.should.have.status(200);
          done()
        });
    });
  });
