import { MikroORM, RequestContext } from '@mikro-orm/core';
import { fastify } from 'fastify';
import { Product } from './modules/product/product.entity.js';

export async function bootstrap(port = 3001) {
  const orm = await MikroORM.init();
  const app = fastify();

  // register request context hook
  app.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(orm.em, done);
  });

  // shut down the connection when closing the app
  app.addHook('onClose', async () => {
    await orm.close();
  });

  // register routes here
  // ...

  app.get('/api/products', async request => {
    const { limit, offset } = request.query as { limit?: number; offset?: number };
    const [items, total] = await orm.em.findAndCount(Product, {}, {
      limit, offset,
    });
  
    return { items, total };
  });

  const url = await app.listen({ port });

  return { app, url };
}