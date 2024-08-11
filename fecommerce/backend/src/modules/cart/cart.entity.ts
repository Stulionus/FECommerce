import { Entity, PrimaryKey, OneToMany, Collection} from '@mikro-orm/core';
import { CartItem } from '../cartItem/cartItem.entity.js';
import { Property } from '@mikro-orm/core';
import { ManyToMany } from '@mikro-orm/core';
import { ObjectId } from 'bson';

@Entity()
export class Cart {

   @PrimaryKey()
   _id!: ObjectId;

   @ManyToMany({entity: () => CartItem, owner: true})
   items = new Collection<CartItem>(this);

   @Property()
   quantity!: number;
}
