import DataLoader from "dataloader";
import { User } from "../entities/User";

// [1,42,3,53] get this
// [{id: 1, username: 'Bob'}, {id: 42, username: 'Bob'}, {...}] return sth like this

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);

    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    //The mapping is done because the order of the array matters
    return userIds.map((userId) => userIdToUser[userId]);
  });
