
import express, {Express} from "express";
import path from "path";
import logger from "morgan";
import indexRouter from "./routes/index";
import cors from "cors";

const port : number = parseInt(process.env.PORT || "5001");

const app : Express = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app;