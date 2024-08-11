import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';
import { Product } from '../product/product.entity.js';
import { Cart } from '../cart/cart.entity.js';
import { Rel } from '@mikro-orm/core';

@Entity()
export class CartItem {

   @PrimaryKey()
   _id!: number;

   @ManyToOne(() => Product)
   product!: Product;

   @ManyToOne(() => Cart)
   cart!: Rel<Cart>;

   @Property()
   quantity!: number;
}
