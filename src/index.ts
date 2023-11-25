import 'dotenv/config';

declare global {
  namespace NodeJS {
    interface ProcessEnv {

    }
  }
}

(async () => {
  console.log(123);
})();
