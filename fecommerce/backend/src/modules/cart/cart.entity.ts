import { Entity, PrimaryKey, OneToMany, Collection, LoadStrategy } from '@mikro-orm/core';
import { CartItem } from '../cartItem/cartItem.entity.js';
import { Property } from '@mikro-orm/core';

@Entity()
export class Cart {

   @PrimaryKey()
   _id!: number;

   @OneToMany(() => CartItem, cartItem => cartItem.cart, { orphanRemoval: true})
   items = new Collection<CartItem>(this);

   @Property()
   quantity!: number;
}
