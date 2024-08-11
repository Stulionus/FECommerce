import { MikroORM, RequestContext } from '@mikro-orm/core';
import { fastify } from 'fastify';
import { Product } from './modules/product/product.entity.js';
import { EntityManager, MongoDriver } from '@mikro-orm/mongodb';
import { Cart } from './modules/cart/cart.entity.js';
import { ObjectId } from 'bson';

export async function bootstrap(port = 3001) {
  const app = fastify();

  const orm = await MikroORM.init({
    entities: [Product, Cart],
    dbName: 'FEcommerce',
    clientUrl: 'mongodb+srv://mcapca:1MOjNIum5yUlWOaz@cluster0.jcl9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    driver: MongoDriver,
  });
  console.log('EntityManager:', orm.em);

  const em = orm.em.fork() as EntityManager;

  try {
    const allProducts = await em.find(Product, {});
    console.log('All products:', allProducts);
  } catch (error) {
    console.error('Error fetching all products:', error);
  }

  try {
    const productId = '66b82de2048e83a65596529c';
    const product = await em.getCollection('Product').findOne({ _id: new ObjectId(productId) });
    if (product) {
      console.log('Product found:', product._id, product.name);
    } else {
      console.log('Product not found');
    }
  } catch (error) {
    console.error('Error finding product:', error);
  }

  const p1 = new Product();
  p1.name = 'Product 1';
  p1.description = 'Description of product 1';
  p1.price = 100;
  p1.img = 'https://via.placeholder'
  em.insert(p1);

  // Register request context hook
  app.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(orm.em, done);
  });

  // Shut down the connection when closing the app
  app.addHook('onClose', async () => {
    await orm.close();
  });

  // Register routes here
  // ...

  app.get('/api/products', async request => {
    const { limit, offset } = request.query as { limit?: number; offset?: number };
    const [items, total] = await orm.em.findAndCount(Product, {}, {
      limit, offset,
    });
  
    return { items, total };
  });

  const url = await app.listen({ port });
  console.log(`Server listening at ${url}`);

  return { app, url };
}
