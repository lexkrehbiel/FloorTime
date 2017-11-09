# FloorTime
To run the node server:
- clone the repo
- run "npm install"
- make the following directories in your file system:
```
project
└───data
      └───audio
      └───seg
      └───wav
      └───json
```
- install mongoDB
- create directory /data/db, and give appropriate permissions
- run "mongod --port 27017 --dbpath /data/db" to start database
- run "node index.js"
- you are now hosting on localhost:8080
