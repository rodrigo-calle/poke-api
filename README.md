<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Run in dev environment

1. Clone repository
2. Run
```bash
pnpm i
```
3. Install Nest globaly

```bash
npm i -g  @nestjs/cli
```

4. Up DB

```bash
docker-compose up
```

5. Clone file __.env.example__ and rename the copy to .env and complete the variables

## Insert seeds in db

Insert data to db using the following command

```bash
curl  http://localhost:3000/api/v2/seed/ -POST
```

## Production Build

1. Create file __.env.prod__
2. Fill prod environment variables
3. Create new image

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
### Test app dockerized

```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up
```

## Stack used

* MongoDB
* Nest