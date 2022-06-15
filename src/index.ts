import express from "express";
import cors from "cors";

import router from "./router";

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

app.listen(process.env.PORT || PORT, () => {
  console.info(`API Server running on port ${PORT}`);
});
