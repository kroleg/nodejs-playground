# Local development instructions
1. You need to either have a Docker and run `docker-compose up` or manually install redis and mongodb
2. Run `npm install` to install all required node modules
3. Run `npm start webpack:dev` to build client-side js and watch for changes
4. Start web server with `npm start:dev`

# Run tests
`npm test`

# Production instructions
1. You need to install redis and mongodb. If they are on remote server or another post you can pass their url via REDIS_URL and MONGO_URL env variables.
See server/config.js for proper example of url formatting
2. Run `npm install` to install all required node modules
3. Run `npm start webpack` to build client-side js
4. Start web server with `npm start`.


