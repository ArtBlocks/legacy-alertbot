import { webhookDataMint, webhookDataMint0, webhookDataUnknownContract, webhookDataChangeInImage } from "./mocks/webhook";

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('/ receives hasura webhook', () => {
  it('receives webhook with new image_id and returns 202', (done) => {
    chai.request(app)
        .post('/')
        .send(webhookDataMint)
        .end((err: any, res: any) => {
          res.should.have.status(202);
          done()
        });
  });
  it('receives webhook with mint 0 and returns 418', (done) => {
    chai.request(app)
        .post('/')
        .send(webhookDataMint0)
        .end((err: any, res: any) => {
          res.should.have.status(418);
          done()
        });
  });
  it('receives webhook for unknown contract and returns 501', (done) => {
    chai.request(app)
        .post('/')
        .send(webhookDataUnknownContract)
        .end((err: any, res: any) => {
          res.should.have.status(501);
          done()
        });
  });
  it('receives webhook with change in image_id and returns 304', (done) => {
    chai.request(app)
        .post('/')
        .send(webhookDataChangeInImage)
        .end((err: any, res: any) => {
          res.should.have.status(304);
          done()
        });
  });
});
