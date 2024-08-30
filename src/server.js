import http from 'http';
import url from 'url';
import routes from './routes.js';

const handler = (async (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  
  let { pathname } = parsedUrl;
  const route = routes.find((routeObjects) => (
    routeObjects.endpoint === pathname.toLowerCase() && routeObjects.method === request.method
  ));

  
  if (route) {

    try {
      await route.handler(request, response)
    } catch (error) {
      console.error(error)
    }
  } else {
    response.writeHead(404, { 'Content-type': 'text/html' });
    response.end(`Cannot ${request.method} ${parsedUrl.pathname}`);
  }
});

const app = http.createServer(handler)
  .listen(3000, () => console.log("running at 3000"))

export default app