import "dotenv/config";
import http from "http";
import app from "./src/app.js";
import env from "./src/config/env.js";
import connectToDB from "./src/config/database.js";

const port = env.PORT;

const server = http.createServer(app);

await connectToDB();

server.listen(port, () => {
  console.log(`Server is up and running on port: ${port}`);
});
