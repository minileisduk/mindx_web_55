const express = require("express");
const router = require("./routers");

const { connectToDb } = require("./database");

const app = express();
app.use(express.json());
//giúp xử lý thêm dữ liệu ko phải dạnh json
app.use(express.urlencoded({ extended: true }));

app.use(router);
app.use("/assets", express.static("assets"));

connectToDb();
app.listen(5000, () => {
  console.log("App is running at 5001");
});
