# Micro frontends: User

This repository is part of a proof of concept, implementing micro frontends, see https://github.com/vuza/micro-frontends for "What the hell are micro frontends".

This repository contains the UI and business logic of the POC's user related views and tasks. It can serve a login and User overview UI and provides paths for login and -out. It set's application wide authorization cookies called `token` which can be used to retrieve user information.

## Usage

Type `npm run start:watch` for development. It'll hot reload your application on changes. See `travis.yml` for AWS Elastic Beanstalk deployment.
