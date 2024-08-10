import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Product{

   @PrimaryKey()
   id!: number;

   @Property()
   name!: string;

   @Property({ type: 'text' })
   description = '';

   @Property({ type: 'float' })
   price = 0.0;

   @Property()
   img!: string;

}