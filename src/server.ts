import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();
const port = env.PORT ?? 3000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
