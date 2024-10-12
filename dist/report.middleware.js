"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDomainInfo = exports.domainNameSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const domainInfoSchema = joi_1.default.object({
    domainName: joi_1.default.string().required(),
    doesAllowAnalyzeContent: joi_1.default.boolean().required(),
    isParkedDomain: joi_1.default.boolean().required(),
    redirectsTo: joi_1.default.string().uri().required(),
    isKnownRegistrar: joi_1.default.boolean().required(),
    isDnsBlackListed: joi_1.default.boolean().required(),
    supportsHsts: joi_1.default.boolean().required(),
    hasFavIcon: joi_1.default.boolean().required(),
    domainAge: joi_1.default.number().integer().min(0).required(),
    domainAgeReadable: joi_1.default.boolean().required(),
    sslState: joi_1.default.object({
        valid: joi_1.default.boolean().required(),
        error: joi_1.default.string().optional(),
    }).required(),
    supportsCSP: joi_1.default.boolean().required(),
    whoisHidden: joi_1.default.boolean().required(),
    implementsReferrerPolicy: joi_1.default.boolean().required(),
    loadsExternalObjects: joi_1.default.boolean().required(),
    isAbnormalUrl: joi_1.default.boolean().required(),
    urlTooLong: joi_1.default.boolean().required(),
    isProtectedAgaintsClickJacking: joi_1.default.boolean().required(),
    isUrlShortened: joi_1.default.boolean().required(),
    doesSupportHSTS: joi_1.default.boolean().required(),
    isProtectedAgainstXSS: joi_1.default.boolean().required(),
    doesLoadExternalObjects: joi_1.default.boolean().required(),
});
exports.domainNameSchema = joi_1.default.string().domain().required().messages({
    "string.domain": "The domainName must be a valid domain.",
    "any.required": "The domainName field is required.",
});
const validateDomainInfo = (req, res, next) => {
    const { error } = domainInfoSchema.validate(req.body.domainInfo);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateDomainInfo = validateDomainInfo;
