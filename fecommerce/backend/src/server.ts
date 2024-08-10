import { MikroORM } from '@mikro-orm/sqlite'; // or any other driver package
import { Product } from './modules/product/product.entity.js';

// initialize the ORM, loading the config file dynamically
const orm = await MikroORM.init();
await orm.schema.refreshDatabase();

const product = new Product();
product.id = 1;
product.name = 'Iphone';
product.description = 'A phone';
product.price = 1000;
product.img = 'iphone.jpg';

const em = orm.em.fork()

await em.persist(product).flush();
console.log('product id is:', product.id);


const ProductById = await em.findOne(product, product.id);
console.log(ProductById == product);

product.description = '...';
await em.flush();