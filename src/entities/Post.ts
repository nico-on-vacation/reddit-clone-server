import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "type-graphql";

@ObjectType() //ths makes it a graphql type
@Entity() //this is for mikro-orm
export class Post {
  @Field()  //this exposes property
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property({type: "date",})
  createdAt = new Date();

  @Field(() => String)
  @Property({ type: "date", onUpdate: () => new Date() })
  updatedAt = new Date();

  @Field()
  @Property({type: "text"})
  title!: string;
}
