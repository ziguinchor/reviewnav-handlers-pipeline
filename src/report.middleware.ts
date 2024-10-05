import { Request, Response, NextFunction } from "express";

import Joi from "joi";

const domainInfoSchema = Joi.object({
  domainName: Joi.string().required(),
  doesAllowAnalyzeContent: Joi.boolean().required(),
  isParkedDomain: Joi.boolean().required(),
  redirectsTo: Joi.string().uri().required(),
  isKnownRegistrar: Joi.boolean().required(),
  isDnsBlackListed: Joi.boolean().required(),
  supportsHsts: Joi.boolean().required(),
  hasFavIcon: Joi.boolean().required(),
  domainAge: Joi.number().integer().min(0).required(),
  domainAgeReadable: Joi.boolean().required(),
  sslState: Joi.object({
    valid: Joi.boolean().required(),
    error: Joi.string().optional(),
  }).required(),
  supportsCSP: Joi.boolean().required(),
  whoisHidden: Joi.boolean().required(),
  implementsReferrerPolicy: Joi.boolean().required(),
  loadsExternalObjects: Joi.boolean().required(),
  isAbnormalUrl: Joi.boolean().required(),
  urlTooLong: Joi.boolean().required(),
  isProtectedAgaintsClickJacking: Joi.boolean().required(),
  isUrlShortened: Joi.boolean().required(),
  doesSupportHSTS: Joi.boolean().required(),
  isProtectedAgainstXSS: Joi.boolean().required(),
  doesLoadExternalObjects: Joi.boolean().required(),
});

export const validateDomainInfo = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = domainInfoSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
