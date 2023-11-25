/* eslint-disable @typescript-eslint/naming-convention */
import 'dotenv/config';
import { writeFile, readFile } from 'fs/promises';
import {
  AccountFollowingFeedResponseUsersItem, IgApiClient,
} from 'instagram-private-api';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      IG_USERNAME: string;
      IG_PASSWORD: string;
    }
  }
}

const target = ['ui.ux.ma', 'ekaterina.web', 'unreal_webdesign', 'veter.dsgn'];

(async () => {
  const [
    ui_ux_ma,
    ekaterina_web,
    unreal_webdesign,
    veter_dsgn,
  ] = (await Promise.all(target.map((user) => readFile(`${user}.json`, 'utf8')))).map((data) => JSON.parse(data)) as unknown as [
    AccountFollowingFeedResponseUsersItem[],
    AccountFollowingFeedResponseUsersItem[],
    AccountFollowingFeedResponseUsersItem[],
    AccountFollowingFeedResponseUsersItem[],
  ];

  console.table([
    ui_ux_ma.length,
    ekaterina_web.length,
    unreal_webdesign.length,
    veter_dsgn.length,
  ]);

  const all = ui_ux_ma.filter(({ pk }) => ekaterina_web.find((user) => user.pk === pk)
    && unreal_webdesign.find((user) => user.pk === pk)
    && veter_dsgn.find((user) => user.pk === pk));
  console.log('🚀 ~ file: index.ts:35 ~ all:', all);

  const ig = new IgApiClient();

  ig.state.generateDevice(process.env.IG_USERNAME);
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  const followersFeed = ig.feed.accountFollowers(1655498794);

  const followers: any[] = [];

  let i = 0;

  followersFeed.items$.subscribe(
    (follower) => {
      console.log(i++);
      followers.push(...follower);
    },
    async (error) => {
      console.error(error);
      await writeFile('ui.ux.ma.json', JSON.stringify(followers, null, 2));
    },
    async () => {
      await writeFile('ui.ux.ma.json', JSON.stringify(followers, null, 2));
      console.log('Complete!');
    },
  );
  // console.log('🚀 ~ file: index.ts:52 ~ followers:', followers);

  // const items = await followersFeed.items();
  // followers.push(...items);

  // const vetee = items.filter((u) => target.includes(u.username));
  // console.log('🚀 ~ file: index.ts:26 ~ vetee:', vetee);
})();
