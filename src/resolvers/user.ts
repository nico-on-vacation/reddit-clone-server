import { MyContext } from "../types";
import {
  Resolver,
  Mutation,
  Arg,
  InputType,
  Field,
  Ctx,
  ObjectType,
  Query,
} from "type-graphql";
import argon2 from "argon2";
import { User } from "../entities/User";

@InputType() //can be used as arguments in graphql
class UsernamePasswordInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType() //can be use as return type of mutation/query
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  error?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, {nullable: true})
  async me (
    @Ctx() {em, req}: MyContext
  ) : Promise <User | null> {
    console.log(req.session)
    if(!req.session.userId){
      return null
    }
    const user = await em.findOne(User, {id: req.session.userId})
    return user
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    if (options.username.length <= 2) {
      return {
        error: [
          {
            field: "username",
            message: "username must be greater than 2",
          },
        ],
      };
    }

    if (options.password.length <= 3) {
      return {
        error: [
          {
            field: "password",
            message: "password must be greater than 3",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: hashedPassword,
    });

    try {
      await em.persistAndFlush(user);
    } catch (e) {
      //ps: remove this line, jsut to pick up: error did not occur for me
      if ((e.code = "23505")) {
        return {
          error: [
            {
              field: "username",
              message: "Username already taken",
            },
          ],
        };
      }
    }

    // sets user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        error: [
          {
            field: "username",
            message: "This username was not found",
          },
        ],
      };
    }

    const isValid = await argon2.verify(user.password, options.password);
    if (!isValid) {
      return {
        error: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id

    return { user };
  }
}
