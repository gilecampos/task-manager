import http from 'http';
import url from 'url';
import routes from './routes.js';

const parseJSON = (request, callback) => {
  let body = [];
  request.on('data', chunk => {
    body.push(chunk);
  });
  
  request.on('end', () => {
    try {
      body = Buffer.concat(body).toString();
      const parsedData = JSON.parse(body);
      callback(parsedData, null);
    } catch (error) {
      callback(null, error);
    }
  });
};

const handler = (async (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  
  let { pathname } = parsedUrl;
  const route = routes.find((routeObjects) => (
    routeObjects.endpoint === pathname.toLowerCase() && routeObjects.method === request.method
  ));
  
  if (route) {
    parseJSON(request, async (data, error) => {
      if (error && (route.method == "POST" || route.method == 'PATCH')) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      try {
        const result = await route.handler(data);
        response.writeHead(result.status, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify(result));
      } catch (error) {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: error.message }));
      }
    });
  } else {
    response.writeHead(404, { 'Content-type': 'text/html' });
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }
});

const app = http.createServer(handler)
  .listen(3000, () => console.log("running at 3000"))

export default app