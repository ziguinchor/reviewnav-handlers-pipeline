import express, {
  type Request,
  type Response,
  type RequestHandler,
  type NextFunction,
} from "express";

import bodyParser from "body-parser";

import DomainInfo from "./report.types";
import runPipeline from "./report.service";
import { validateDomainInfo } from "./report.middleware";

const app = express();
const PORT = process.env.PORT || 9090;

var jsonParser = bodyParser.json();
app.use(jsonParser);

const asyncMiddleware = (ReqHandler: RequestHandler<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await ReqHandler(req, res, next);
    } catch (err: unknown) {
      next(err);
    }
  };
};

app.post(
  "/reports",
  // @ts-ignore
  validateDomainInfo,
  asyncMiddleware((req: Request<any, any, DomainInfo>, res: Response) => {
    const domainInfo: DomainInfo = req.body;
    const results = runPipeline(domainInfo);
    res.json(results);
  })
);

app.listen(PORT, () => {
  console.log("Server ready at " + PORT);
});
