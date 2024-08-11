import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

@Entity()
export class Product{

   @PrimaryKey()
  _id!: ObjectId;

   @Property()
   name!: string;

   @Property()
   description!: string;

   @Property({ type: 'double' })
   price = 0.0;

   @Property()
   img!: string;

}