# member-mq

## Description

A [Nest framework TypeScript ](https://github.com/nestjs/nest) CRUD RestAPI with Message Queue.
With Postgres as the Database and a docker-compose file to run the DB in Docker.

## Features
- User Authentication & Authorisation
- Prisma ORM with Postgres
- Message Queues to handle intensive task such as Sending SNS to users
- SMS integration
- Redis and BullMQ to handle Queues
- Docker

## Getting Started in Development mode

```bash
# development
$ npm install

# start postgres in docker and push migrations
$ npm run db:dev:restart 

# production mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```


