import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Product } from '../product/product.entity.js';

@Entity()
export class Cart {

   @PrimaryKey()
   _id!: number;

   @ManyToOne(() => Product, { nullable: true })
   product!: Product;

   @Property()
   quantity!: number;

}
