# my-weather-server
Contains the source code for the rest server for the my weather recording system

## Running Tests

To run the mocha tests as well as report on test coverage, use the following command. Coverage reports can be viewed with the web interface.
```
$ gulp test
```
Make sure the mongo instance pointed to by the environment variables (see below) is up and running.

For testing the front end, run 

$ gulp lint
<!-- $ jasmine-node . -->

## Installation from scratch on main server

Clone repo:
$ git clone ....
$ cd my-weather-server
$ npm install
If using  pm2:
$ sudo pm2 start ./bin/www
else
$npm start

Update from repo
$ cd my-weather-server-server
$ git pull
$ npm install
If using  pm2:
$ sudo pm2 restart www
else
$npm start

## Environments

Environment variables for the rest server port and the mongo server ip and port are contained in the .env file. This is not contained in the repo. An example is:
```
DB_SERVER='CSJHBAN8G8WN.local'
DB_PORT='27017'
PORT='3000'
DB_USER='xxxxx'
DB_PWD='xxxx'
```
Don't forget to ensure that the correct database users has been created with the correct roles:
db.createUser(
   {
     user: "accountUser",
     pwd: "password",
     roles: [ "readWrite", "dbAdmin" ]
   }
)

## Simulations

The script logdata.js will log temperatures (once per run) for testing purposes. It should be run via a scheduler. It does need to following variables added to the environment file. If running on Heroku, the Heroku scheduler works well.
```
API_KEY=forecast.io-api-key
REST_SERVER=the-backend-server
REST_PORT=80
```

