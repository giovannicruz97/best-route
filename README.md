# :airplane: Best Route

<p align="center">
  <img src="https://media.giphy.com/media/rDroB384ydCvK/giphy.gif">
</p>

"Best Route" was built using Express with REST and CLI interfaces to find the cheapest route between two airports. This solution uses Dijkstra's algorithm to solve the "Shortest path problem". There are other possible algorithms to solve this kind of problem and can be found [here](https://en.wikipedia.org/wiki/Shortest_path_problem), but the Dijkstra's algorithm solves that with non-negative edge weight to find the best route. The weight between two nodes (airports) has to be positive, because the weight used here is the money.

## Requirements

- [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
  - Node v15.10.0
  - NPM 7.6.0
- [Postman](https://www.postman.com/downloads/)

## Architecture

- `src/index.js`: Server listener file
- `src/app.js`: Initial file to bootstrap routes and middlewares
- `src/modules`: Directory responsible to group specific domains and its files, such as controllers, services etc
- `src/routes`: Routes file for the REST API
- `src/test`: Directory responsible to group different kind of tests, such as unit, functional and integration tests. Initially, there are only unit tests.

## How to run it ?

1. `git clone https://github.com/giovannicruz97/best-route.git`
2. `cd /best-route`
3. `nvm use`
   1. If you don't have Node v15.10.0 installed with NVM, please run: `nvm install v15.10.0 && nvm use`
4. `npm i`
5. You're ready to next steps

> Be aware to provide an input csv file using CLI first, before using the REST API

### CLI

To run the CLI you must provide a csv with "origin,destination,cost" pattern. You can use the following file as input example:

```
GRU,BRC,10
BRC,SCL,5
GRU,CDG,75
GRU,SCL,20
GRU,ORL,56
ORL,CDG,5
SCL,ORL,20
```

To run the CLI, please run: `npm run best-route [my-input-routes.csv]`

After providing an input csv file, you're ready to use the the REST API to create new airports connections and find the best route using the last inputed file via CLI as a database.

### REST API

All request were made using Postman. The API contracts can be found [here](https://documenter.getpostman.com/view/3700935/Tz5jf1T1). To run the REST API, please run: `npm start`

## Tests

- `npm run test`

## Contact

- Email: giocruz.it@gmail.com
