# How to set up

First of all two environement variables required. Easiest way to use
`.env` file in root project directory.
1. DATABOX_TOKEN
2. GITHUB_TOKEN

Example of `.env` file:

```
DATABOX_TOKEN=somesecrettokenhere
GITHUB_TOKEN=somesecrettokenhere
```

Github token MUST have the scope **public_repo**.
It is on github.com website (Settings -> Developer Settings
-> Personal access tokens)

# How to run

1. First we build docker image.

`docker build -t databox .`

2. We run it

`docker run --env-file=.env -e DEBUG=* --rm databox`

# How to lint test

1. `npm run lint`
2. `npm run test`
3. `npm run ts-build`
