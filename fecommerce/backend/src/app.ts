import { MikroORM, RequestContext } from '@mikro-orm/core';
import { fastify } from 'fastify';
import { Product } from './modules/product/product.entity.js';
import { EntityManager, MongoDriver } from '@mikro-orm/mongodb';
import { Cart } from './modules/cart/cart.entity.js';
import { ObjectId } from 'bson';
import { CartItem } from './modules/cartItem/cartItem.entity.js';

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

  // const createCartWithItems = async () => {
  //   // Create a new cart
  //   const cart = new Cart();
  //   cart.quantity = 0;

  //   // Fetch products from the database
  //   const product = await em.findOne(Product, { _id: new ObjectId('66b8476e4484fba2e6451565')}); // Example product ID
  
  //   if (product) {
  //     // Create cart items
  //     const cartItem = new CartItem();
  //     cartItem.product = product;
  //     cartItem.quantity = 2; // Example quantity
  //     cartItem.cart = cart;
  
  //     // Add items to cart
  //     cart.items.add(cartItem);
      
  //     // Persist the cart and items
  //     await em.persistAndFlush(cart);
  //     console.log('Cart created with items:', cart);
  //   } else {
  //     console.log('Product not found');
  //   }
  // };

  // await createCartWithItems();

  // try {
  //   const allProducts = await em.find(Product, {});
  //   console.log('All products:', allProducts);
  // } catch (error) {
  //   console.error('Error fetching all products:', error);
  // }


  // Register request context hook
  app.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(orm.em, done);
  });

  // Shut down the connection when closing the app
  app.addHook('onClose', async () => {
    await orm.close();
  });

  // app.post('/api/cart', async (request, reply) => {
  //   const { productId, quantity } = request.body as { productId: string; quantity: number };

  //   if (!productId || quantity === undefined) {
  //     return reply.status(400).send({ error: 'Missing productId or quantity' });
  //   }

  //   try {
  //     const product = await em.findOne(Product, { _id: new ObjectId(productId) });
  //     if (!product) {
  //       return reply.status(404).send({ error: 'Product not found' });
  //     }

  //     const cartItem = new Cart();
  //     cartItem.product = product;
  //     cartItem.quantity = quantity;

  //     await em.persistAndFlush(cartItem);
  //     reply.status(201).send(cartItem);
  //   } catch (error) {
  //     reply.status(500).send({ error: 'Error adding item to cart' });
  //   }
  // });


  // app.get('/api/cart', async (request, reply) => {
  //   try {
  //     const cartItems = await em.find(Cart, {}, {
  //       populate: ['product'],
  //     });

  //     reply.send(cartItems);
  //   } catch (error) {
  //     reply.status(500).send({ error: 'Error fetching cart items' });
  //   }
  // });


  app.get('/api/products', async (request, reply) => {
    const { limit, offset } = request.query as { limit?: number; offset?: number };

    try {
      const [items, total] = await em.findAndCount(Product, {}, {
        limit, offset,
      });
      reply.send({ items, total });
    } catch (error) {
      reply.status(500).send({ error: 'Error fetching products' });
    }
  });

  const url = await app.listen({ port });
  console.log(`Server listening at ${url}`);

  return { app, url };
}
