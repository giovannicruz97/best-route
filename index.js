const http = require('http');
const app = require('./src/app');
const port = '5566';

const server = http.createServer(app);

const listen = () => {
  server.listen(port);
  server.on('listening', () => console.log(`🚀 Listenning at ${port}`));
  server.on('error', (error) => console.error(`❌  [APP] Error: ${error}`));
};

try {
  listen();
} catch (error) {
  console.error(`❌ ${error}`);
  process.exit(0);
}
