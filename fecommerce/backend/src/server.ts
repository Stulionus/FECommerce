
// initialize the ORM, loading the config file dynamically
import { bootstrap }  from './app.js';

try {
  const { url } = await bootstrap();
  console.log(`server started at ${url}`);
} catch (e) {
  console.error(e);
}