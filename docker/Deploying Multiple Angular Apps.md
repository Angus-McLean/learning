# Deploying Multiple Angular Apps
## The Business Case
    Sometimes a given project will have to have different UI's / portals for dealing with the same application, eg admin and public facing apps. In this situation we'd like to keep one code base as most services, data models and many components will be reused between the two apps.
## The Goal
    We'd like to be able to run different version of the same angular codebase. These apps should be build seperate images and should run in independent containers.


## Solution Overview
1. Define different Angular apps within the project
1. Modify the Dockerfile to deploy with the different Angular app
1. 
## .angular-cli.json
    Angular has built in support for different apps within the codebase. They can be specified in build and run commands by providing the --app flag which matches the apps[].name property.

```bash
APP_NAME=public
ng build --app=$APP_NAME
```
    Below is the .angular-cli.json where the different apps are specified and the outDir where the packaged js files should go. We'll be outputting them to seperate folders so both these projects can be built on the same host at the same time without conflict.

```bash
{
  "apps": [
    {
      "name": "public",
      "outDir": "dist/public"
    },
    {
      "name": "admin",
      "outDir": "dist/admin"
    }
  ]
}
```


## Build.sh
    This script is run before the Dockerfile is built.

```bash
npm install
npm run build -- --app=$APP_NAME
```
## Dockerfile Arguments
    The packaged files we are serving for each app exist in different folders on the host. We point the COPY command in the Dockerfile to the appropriate location with the APP_NAME build variable.

```bash
FROM nginx

ARG APP_NAME

MAINTAINER Angus McLean
EXPOSE 4200
EXPOSE 4201

COPY dist/$APP_NAME /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/nginx.conf.template
COPY run.sh /run.sh

CMD ["/bin/sh", "/run.sh"]
```
    Build arguments can be passed to docker build commands as follows : 

```bash
docker build --build-arg APP_NAME=public
```
## Docker Compose building
    Below is the docker-compose.yml file for building and deploying the 2 different angular apps. Notice the port mappings and the build arguments.

```bash
services:
  app_ui_public:
    restart: always
    image: app_ui_public:dev
    ports:
      - "4200:4200"
      - "4201:4201"
    environment:
      - API_URL=app_api:8080
    build:
      context: ./app_ui
      dockerfile: Dockerfile
      args:
        - APP_NAME=public

  app_ui_admin:
    restart: always
    image: app_ui_admin:dev
    ports:
      - "4202:4200"
      - "4203:4201"
    environment:
      - API_URL=app_api:8080
    build:
      context: ./app_ui
      dockerfile: Dockerfile
      args:
        - APP_NAME=admin
```


