# Task
The purpose of the task is to build a Databox integration that
lets you
extract metrics from a variety of source types and send them
to the Databox platform via Push API. Your quest:
1. Get 5-10 metrics from two different APIs or other sources and
push them into Databox
2. At least one of those services has to use OAuth 2
authorization
3. Min 50% unit test code coverage
4. Simple deployment (keep in mind that
someone will have to run the
code)
5. Periodic sending trigger

## Other info:
1. Start with [1]http://developers.databox.com/
2. Use the language of your choice

## Suggested services to integrate:
1. GitHub
2. Google Analytics
3. Facebook
4. Instagram
5. or any other by your choice


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

Github token should have specific scope _public_repo_.
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

Most of the code has TypeScript declarations. Some tests could be
written but presume application is very simple and at this point
tests are not required.