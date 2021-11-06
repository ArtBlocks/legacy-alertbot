# art-blocks-alert-bot

A twitter bot that:

- Posts every newly minted Art Block NFT to Twitter
- Forwards it's Tweets to a Discord bot `activity-bot` to post in the `artblocks-mints` channel

## Deployment

Current deployment is less than ideal. However, due to bandwidth constraints and prioritizaiton, it is good enough for now to have this running on ECS with the clunky deployment steps.

The steps are a bit clunky due to a redis database and web app being deployed together via `docker-compose.yml`, and then using docker to translate that to proper AWS deployments on-the-fly via `docker compose`. AWS does not support image building, so `docker compose` requires that all images be built and sent to ECR prior to running the command ([ref](https://docs.docker.com/cloud/ecs-compose-features/)).

Ideally, this process could be ran as a simple single docker container and potentially use our main web database to track latest block alerted (instead of redis).

1.  Clone repository
2.  Build web service docker image
    ```shell
    cd app
    ```
    ensure docker context is set to a non-ecs context (such as default)
    ```shell
    docker context use default
    ```
    build (using buildx if building on an M1 (ARM) device)
    ```shell
    docker buildx build --platform=linux/amd64 -t artblocks-alertbot-web .
    ```
    after build completes, tag your image so you can push the image to the repository:
    ```shell
    docker tag artblocks-alertbot-web:latest 568813240935.dkr.ecr.us-east-1.amazonaws.com/artblocks-alertbot-web:latest
    ```
    push the image to our AWS repository
    > Note: If you experience permissions errors, ensure you docker is properly logged in by filling out and running the template script in `/scripts/docker_login_to_ecs.template.sh`.
    ```shell
    docker push 568813240935.dkr.ecr.us-east-1.amazonaws.com/artblocks-alertbot-web:latest
    cd ../
    ```

3.  Switch to ecs context. If you don't have one, see [this tutorial](https://aws.amazon.com/blogs/containers/deploy-applications-on-amazon-ecs-using-docker-compose/), expecially paragraph that starts with:

    > First, we will create a new docker context so that the Docker CLI can point to a different endpoint.

    ```shell
    docker context use myecscontext
    ```

4.  Ensure environment variables are defined.

- Deployment environment variables should be defined in `/app/.env.remote` (see `/app/.env.example` for starting template; contact devs for values).

5.  Ensure /app/.env.remote is up-to-date
    >Note: `OVERRIDE_LAST_BLOCK_ALERTED_ON_INITIALIZE` should only be set if initial deployment and you want to go back in time. It is used to initialize the redis database block to start from (default when not defined is `current_block - offset - 1`).

6.  Use docker+aws integration to ship to remote

    ```shell
    docker compose -f docker-compose.base.yml -f docker-compose.remote.yml up
    ```

7.  Don't forget to switch back to your normal docker context. e.g.:

    ```shell
    docker context use default
    ```

# Local Development

Run the app as you would any other node project.

Helpful notes:

- `.env.dev` must be populated in the src folder. see `.env.example` for starting point.
- If you want to run docker-compose deployments locally, images can be built on the fly (since not using ecs). Ensure docker context set to non-ecs (e.g. `docker context use default`), then simply run from the root folder:
  ```shell
  docker compose -f docker-compose.base.yml -f docker-compose.dev.yml up -d --build
  ```
  > Note: `--build` recommended to force rebuild of service:web image from Dockerfile

- Shut down docker-compose deployments via the `down` command
  ```shell
  docker compose -f docker-compose.base.yml -f docker-compose.dev.yml down
  ```
