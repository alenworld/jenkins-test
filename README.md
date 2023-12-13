# ALENWORLD

> Nest.js API. PostgreSQL, Redis

### Project Introduction
- Support ES6/ES7 features
- Using Eslint followed [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Husky
- Commitizen
- Docker
- Prettier

## Features
##### Authentication:
- passport local strategy
- jwt authentication
##### Session Storage:
- PostgreSQL
- Redis
##### Integration testing
- supertest

## Requirements

- node >= 16
- npm >= 8
- postgresql >= 12.0
- typescript >= 3.0

App Skeleton

```
├── src
│├── routes
││├── app
│││   └── ...
││├── v1
│││├── auth
││││   └── ...
│││└── users
││     └── ...
│├── dto
││└── ...
│├── filters
││└── ...
│├── guards
││└── ...
│├── main.ts
│└── pipes
│    └── ...
├── docker-compose.yml
├── index.js
├── nest-cli.json
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json

```

## Running the API

### Migrations

Local:
```bash
npm run build

npm run schema:sync

npm run migration
```

Docker:
```
sudo docker exec -it app bash

npm run migration
```

### Development
To start the application in development mode, run:

```bash
npm run start:dev
```

### Docker

``` 
sudo docker-compose up 
```
  
## Set up environment
Example environments you can find in `.env.example`.
        
## Swagger
Swagger documentation will be available on route:
```bash
http://localhost:3000/api
```
