import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import microConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import redis from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from 'cors'

const main = async () => {
  const orm = await MikroORM.init(microConfig); //connect DB
  await orm.getMigrator().up(); //run migrations

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = redis.createClient();

  app.use(cors({ //fixes cors error on all routes 
    origin: 'http://localhost:3000',
    credentials: true
  }))

  //applying redis middleware before apollo is important
  //because we use it inside apollo, and the way we add middleware is
  //the sequence it will run
  app.use(
    session({
      name: "qid",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true, //disables TTL refresh
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // cookie only works over https
      },
      saveUninitialized: false,
      secret: "20fsi0pdnf10pidnfasdn023ewf",
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      em: orm.em,
      req,
      res,
    }),
  });

  apolloServer.applyMiddleware({ app, cors: false }); //disable cors on apolloServer

  app.listen(4000, () => {
    console.log("Listening on port 4000");
  });
};

main();
