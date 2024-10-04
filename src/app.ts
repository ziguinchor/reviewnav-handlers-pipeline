import express, {
  type Request,
  type Response,
  type RequestHandler,
  type NextFunction,
} from "express";

import DomainInfo from "./report.type";
import runPipeline from "./report.service";

const app = express();
const PORT = process.env.PORT || 9090;

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
  asyncMiddleware((req: Request<any, any, DomainInfo>, res: Response) => {
    const domainInfo: DomainInfo = req.body;
    runPipeline(domainInfo);
  })
);

app.listen(PORT, () => {
  console.log("Server ready at " + PORT);
});
