# QCRM

CI: [![<CircleCI>](https://circleci.com/gh/liveisgood8/cis-back.svg?style=shield)](https://circleci.com/gh/liveisgood8/cis-back)

---

[1. Description](#description)

[2. Getting started](#getting-started)

## Description

System for business, helps to control relations with customers and customer workflow.

Main features:

* Control incoming emails and assign customer requests to your conpany members;
* Create structured information about customers, contracts and tasks and search for it;
* Creat and assign tasks to your company memebers;
* Handle customer requests via sending emails with answer.

## Getting started

Fristly you need docker and docker compose.
Secondly you should configure SMTP server for sending emails in [`src/utils/mail`](https://github.com/liveisgood8/cis-back/blob/master/src/utils/mail/prod.ts).

After that you can execute following command from repository dir for build and deploy service locally:

```
export SMTP_USER=your_yandex_smtp_user
export SMTP_PASSWORD=your_yandex_smtp_password
docker-compose up
```


