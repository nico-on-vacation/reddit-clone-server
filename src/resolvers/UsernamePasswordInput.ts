import { Field, InputType } from "type-graphql";


@InputType() //can be used as arguments in graphql
export class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}
