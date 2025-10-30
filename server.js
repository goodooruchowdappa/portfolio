const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use('/api', router);
server.listen(3001, () => {
  console.log('JSON Server running at http://localhost:3001/api');
});
