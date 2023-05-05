# member-mq

## Description

A [Nest framework TypeScript ](https://github.com/nestjs/nest) CRUD RestAPI with Message Queue.
With Postgres as the Database and a docker-compose file to run the DB in Docker.

## Live Demo

The Live Demo of the Application can be view [here](https://membrmq-dashboard.vercel.app/)

## Features
- User Authentication & Authorization
- Member Management
- Prisma ORM with Postgres
- Cron Jobs 
- Message Queues to handle intensive task such as Sending SMS to users
- SMS integration
- Redis and BullMQ to handle Queues
- Docker

## Getting Started in Development mode

```bash
# development
$ npm install

# start postgres in docker and push migrations
$ npm run db:dev:restart 

# start the server
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

```


