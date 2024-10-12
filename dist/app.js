"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const php_serialize_1 = require("php-serialize");
const report_service_1 = __importDefault(require("./report.service"));
const report_middleware_1 = require("./report.middleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 9090;
console.clear();
var jsonParser = body_parser_1.default.json();
app.use(jsonParser);
const asyncMiddleware = (ReqHandler) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield ReqHandler(req, res, next);
        }
        catch (err) {
            next(err);
        }
    });
};
app.post("/reports", 
// @ts-ignore
asyncMiddleware((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { domainName } = req.body;
    const { error } = report_middleware_1.domainNameSchema.validate(domainName);
    if (error) {
        // Respond with validation error details
        res.status(400).json({ error: error.details[0].message });
        return;
    }
    const results = yield (0, report_service_1.default)(domainName);
    res.json((0, php_serialize_1.serialize)(results));
})));
app.use((err, req, res, next) => {
    // Handle other types of errors
    console.log(err);
    res.status(500).json({
        error: "An internal server error occurred.",
    });
});
app.listen(PORT, () => {
    console.log("Server ready at " + PORT);
});
