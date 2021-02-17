import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

// [{postId: 5, userId: 10}, {...}] get this
// return {postId: 5, userId: 10, value: 1}

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (keys) => {
      const updoots = await Updoot.findByIds(keys as any);
      const updootIdsToUpdoot: Record<string, Updoot> = {};
      updoots.forEach((u) => {
        updootIdsToUpdoot[`${u.userId}|${u.postId}`] = u;
      });

      //The mapping is done because the order of the array matters
      return keys.map(
        (key) => updootIdsToUpdoot[`${key.userId}|${key.postId}`]
      );
    }
  );
