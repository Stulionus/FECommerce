import { MikroORM, RequestContext } from '@mikro-orm/core';
import { fastify } from 'fastify';
import { Product } from './modules/product/product.entity.js';
import { EntityManager, MongoDriver } from '@mikro-orm/mongodb';
import { Cart } from './modules/cart/cart.entity.js';
import { ObjectId } from 'bson';
import { CartItem } from './modules/cartItem/cartItem.entity.js';

// Initialize and configure the server
export async function bootstrap(port = 3001) {
  const app = fastify();

  // Initialize MikroORM
  const orm = await MikroORM.init({
    entities: [Product, Cart],
    dbName: 'FEcommerce',
    clientUrl: 'mongodb+srv://mcapca:1MOjNIum5yUlWOaz@cluster0.jcl9v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    driver: MongoDriver,
  });
  console.log('EntityManager:', orm.em);

  const em = orm.em.fork() as EntityManager;

  // Add product to the cart
  const addToCart = async (productId: string) => {
    const cartId = new ObjectId('66b8f6fcc9631e3241dbe624');

    try {
      const cart = await em.findOne(Cart, { _id: cartId }, { populate: ['items.product'] });

      if (!cart) {
        console.log('Cart not found');
        return;
      }

      const product = await em.findOne(Product, { _id: new ObjectId(productId) });

      if (!product) {
        console.log('Product not found');
        return;
      }

      let cartItem = cart.items.getItems().find(item => item.product._id.equals(product._id));

      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        cartItem = new CartItem();
        cartItem.product = product;
        cartItem.quantity = 1;
        cart.items.add(cartItem);
      }

      cart.quantity = cart.items.getItems().reduce((sum, item) => sum + item.quantity, 0);

      await em.persistAndFlush(cart);
      console.log('Cart updated with product:', product);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  // Remove product from the cart
  const removeFromCart = async (productId: string) => {
    const cartId = new ObjectId('66b8f6fcc9631e3241dbe624');

    try {
      const cart = await em.findOne(Cart, { _id: cartId }, { populate: ['items.product'] });

      if (!cart) {
        console.log('Cart not found');
        return;
      }

      const product = await em.findOne(Product, { _id: new ObjectId(productId) });

      if (!product) {
        console.log('Product not found');
        return;
      }

      const cartItem = cart.items.getItems().find(item => item.product._id.equals(product._id));

      if (cartItem) {
        if (cartItem.quantity > 1) {
          cartItem.quantity -= 1;
        } else {
          cart.items.remove(cartItem);
        }

        cart.quantity = cart.items.getItems().reduce((sum, item) => sum + item.quantity, 0);

        await em.persistAndFlush(cart);
        console.log('Cart updated by removing product:', product);
      } else {
        console.log('Cart item not found');
      }
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  // Middleware to set up request context for MikroORM
  app.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(orm.em, done);
  });

  // Close MikroORM connection when server shuts down
  app.addHook('onClose', async () => {
    await orm.close();
  });

  // Endpoint to add a product to the cart
  app.post('/api/cart/add', async (request, reply) => {
    const { productId } = request.body as { productId: string };

    if (!productId) {
      return reply.status(400).send({ error: 'Missing productId' });
    }

    try {
      await addToCart(productId);
      reply.status(200).send({ success: true });
    } catch (error) {
      reply.status(500).send({ error: 'Error adding item to cart' });
    }
  });

  // Endpoint to remove a product from the cart
  app.post('/api/cart/remove', async (request, reply) => {
    const { productId } = request.body as { productId: string };

    if (!productId) {
      return reply.status(400).send({ error: 'Missing productId' });
    }

    try {
      await removeFromCart(productId);
      reply.status(200).send({ success: true });
    } catch (error) {
      reply.status(500).send({ error: 'Error removing item from cart' });
    }
  });

  // Endpoint to get the current state of the cart
  app.get('/api/cart', async (request, reply) => {
    const cartId = new ObjectId('66b8f6fcc9631e3241dbe624');

    try {
      const cart = await em.findOne(Cart, { _id: cartId }, { populate: ['items.product'] });

      if (!cart) {
        reply.status(404).send({ error: 'Cart not found' });
        return;
      }

      const totalQuantity = cart.items.getItems().reduce((sum, item) => sum + item.quantity, 0);
      cart.quantity = totalQuantity;

      reply.send(cart);
    } catch (error) {
      reply.status(500).send({ error: 'Error fetching cart' });
    }
  });

  // Endpoint to fetch a list of products
  app.get('/api/products', async (request, reply) => {
    const { limit, offset } = request.query as { limit?: number; offset?: number };

    try {
      const [items, total] = await em.findAndCount(Product, {}, { limit, offset });
      reply.send({ items, total });
    } catch (error) {
      reply.status(500).send({ error: 'Error fetching products' });
    }
  });

  // Endpoint to fetch a single product by ID
  app.get('/api/product/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const product = await em.findOne(Product, { _id: new ObjectId(id) });

      if (!product) {
        reply.status(404).send({ error: 'Product not found' });
        return;
      }

      reply.send(product);
    } catch (error) {
      reply.status(500).send({ error: 'Error fetching product' });
    }
  });

  // Start the server and listen on the specified port
  const url = await app.listen({ port });
  console.log(`Server listening at ${url}`);

  return { app, url };
}
