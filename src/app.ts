import express, {
  type Request,
  type Response,
  type RequestHandler,
  type NextFunction,
} from "express";
import bodyParser from "body-parser";
import { serialize } from "php-serialize";

import runPipeline from "./report.service";
import { domainNameSchema } from "./report.middleware";

const app = express();
const PORT = process.env.PORT || 9090;

console.clear();

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
  asyncMiddleware(
    async (req: Request<any, any, { domainName: string }>, res: Response) => {
      const { domainName } = req.body;
      const { error } = domainNameSchema.validate(domainName);
      if (error) {
        // Respond with validation error details
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const results = await runPipeline(domainName);

      res.json(serialize(results));
    }
  )
);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  // Handle other types of errors
  console.log(err);
  res.status(500).json({
    error: "An internal server error occurred.",
  });
});

app.listen(PORT, () => {
  console.log("Server ready at " + PORT);
});
