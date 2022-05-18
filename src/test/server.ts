import {
  webhookDataMint,
  webhookDataMint0,
  webhookDataSkippedProject,
  webhookDataUnknownContract,
  webhookDataChangeInImage,
} from './mocks/webhook';

//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../index');
let should = chai.should();
chai.use(chaiHttp);

describe('ArtBlocks / receives hasura webhook', () => {
  before(() => {
    process.env.IS_PBAB = 'false';
  });
  it('receives webhook with new image_id and returns 202', (done) => {
    chai
      .request(app)
      .post('/')
      .send(webhookDataMint)
      .end((err: any, res: any) => {
        res.should.have.status(202);
        done();
      });
  });
  it('receives webhook with mint 0 and returns 418', (done) => {
    chai
      .request(app)
      .post('/')
      .send(webhookDataMint0)
      .end((err: any, res: any) => {
        res.should.have.status(418);
        done();
      });
  });
  it('receives webhook with a skipped project and returns 418', (done) => {
    chai
      .request(app)
      .post('/')
      .send(webhookDataSkippedProject)
      .end((err: any, res: any) => {
        res.should.have.status(418);
        done();
      });
  });
  it('receives webhook for unknown contract and returns 501', (done) => {
    chai
      .request(app)
      .post('/')
      .send(webhookDataUnknownContract)
      .end((err: any, res: any) => {
        res.should.have.status(501);
        done();
      });
  });
  it('receives webhook with change in image_id and returns 304', (done) => {
    chai
      .request(app)
      .post('/')
      .send(webhookDataChangeInImage)
      .end((err: any, res: any) => {
        res.should.have.status(304);
        done();
      });
  });
});

describe('PBAB / receives hasura webhook', () => {
  before(() => {
    process.env.IS_PBAB = 'true';
    process.env.PBAB_CONTRACT = '0x87c6e93fc0b149ec59ad595e2e187a4e1d7fdc25';
  });
  it('receives webhook with new image_id and returns 202', (done) => {
    chai
      .request(app)
      .post('/')
      .send(webhookDataMint)
      .end((err: any, res: any) => {
        res.should.have.status(202);
        done();
      });
  });
  it('receives webhook with mint 0 and returns 418', (done) => {
    chai
      .request(app)
      .post('/')
      .send(webhookDataMint0)
      .end((err: any, res: any) => {
        res.should.have.status(418);
        done();
      });
  });
  it('receives webhook with a skipped project and returns 418', (done) => {
    chai
      .request(app)
      .post('/')
      .send(webhookDataSkippedProject)
      .end((err: any, res: any) => {
        res.should.have.status(418);
        done();
      });
  });
  it('receives webhook for unknown contract and returns 501', (done) => {
    chai
      .request(app)
      .post('/')
      .send(webhookDataUnknownContract)
      .end((err: any, res: any) => {
        res.should.have.status(501);
        done();
      });
  });
  it('receives webhook with change in image_id and returns 304', (done) => {
    chai
      .request(app)
      .post('/')
      .send(webhookDataChangeInImage)
      .end((err: any, res: any) => {
        res.should.have.status(304);
        done();
      });
  });
});
