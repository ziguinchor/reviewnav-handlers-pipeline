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
exports.runPipeline = void 0;
exports.default = default_1;
const axios_1 = __importDefault(require("axios"));
const report_constants_1 = require("./report.constants");
const report_helpers_1 = require("./report.helpers");
const report_model_1 = require("./report.model");
const runPipeline = (domainInfo, funcs) => {
    return funcs.reduce((currentDomainInfo, func) => func(currentDomainInfo), domainInfo);
};
exports.runPipeline = runPipeline;
function doesAllowAnalyzeContent(domainInfo) {
    if (!domainInfo.doesAllowAnalyzeContent) {
        domainInfo.preDefinedHighlights.negative.add(report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.DOES_NOT_ALLOW_ANALYSE_CONTENT);
    }
    return domainInfo;
}
function globalRank(domainInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        const globalRank = yield (0, report_helpers_1.getGlobalRank)(domainInfo.domainName);
        domainInfo.globalRank = globalRank;
        const withinTop100k = globalRank > 0 && globalRank <= 200000;
        const withinTop200k = globalRank > 0 && globalRank <= 200000;
        const withinTop500k = globalRank > 0 && globalRank <= 500000;
        const withinTop1m = globalRank != 0;
        // Optimizations : Check Guards
        if (withinTop1m) {
            domainInfo.isAbnormalUrl = false;
            domainInfo.preDefinedHighlights.positive.add(report_constants_1.HIGHLIGHT_LABELS_POSITIVE.NOT_DNS_BLACKLISTED);
        }
        if (withinTop500k) {
            domainInfo.isParkedDomain = false;
            domainInfo.doesSupportHSTS = true;
            domainInfo.isProtectedAgaintsClickJacking = true;
            domainInfo.supportsCSP = true;
            domainInfo.isProtectedAgainstXSS = true;
            domainInfo.implementsReferrerPolicy = true;
            domainInfo.isKnownRegistrar = true;
            [
                report_constants_1.HIGHLIGHT_LABELS_POSITIVE.IMPLEMENTS_REFERER_POLICY,
                report_constants_1.HIGHLIGHT_LABELS_POSITIVE.SAFE_BY_GOOGLE_SAFE_BROWSING,
                report_constants_1.HIGHLIGHT_LABELS_POSITIVE.SAFE_DNS_FILTER,
                report_constants_1.HIGHLIGHT_LABELS_POSITIVE.RANKED_AMONG_TOP_5OOK,
                report_constants_1.HIGHLIGHT_LABELS_POSITIVE.REGISTRAR_GOOD_REPUTATION,
                report_constants_1.HIGHLIGHT_LABELS_POSITIVE.SUPPORTS_HSTS,
                report_constants_1.HIGHLIGHT_LABELS_POSITIVE.IMPLEMENTS_REFERER_POLICY,
                report_constants_1.HIGHLIGHT_LABELS_POSITIVE.PROTECTED_AGAINST_INJECTION,
            ].forEach((label) => {
                domainInfo.preDefinedHighlights.positive.add(label);
            });
            domainInfo.preComputedScore = 100;
        }
        if (withinTop200k) {
            domainInfo.doesLoadExternalObjects = false;
        }
        if (withinTop100k) {
            domainInfo.preDefinedHighlights.positive.delete(report_constants_1.HIGHLIGHT_LABELS_POSITIVE.RANKED_AMONG_TOP_5OOK);
            domainInfo.preDefinedHighlights.positive.add(report_constants_1.HIGHLIGHT_LABELS_POSITIVE.RANKED_AMONG_TOP_1OOK);
        }
        return domainInfo;
    });
}
const handlers = [doesAllowAnalyzeContent, globalRank];
function default_1(domaineName) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = "https://projects-lab.com/whois-domain/index.php?domain=" + domaineName;
        let { data } = yield axios_1.default.get(url);
        if (typeof data == "string") {
            const jsonMatch = data.match(/{.*}/);
            if (!jsonMatch)
                throw new Error("Response malformed!");
            data = JSON.parse(jsonMatch[0]);
        }
        let { domainInfo, data: preData } = data;
        domainInfo.domainName = domaineName;
        // console.log(domainInfo);
        domainInfo.preDefinedHighlights = {
            negative: new Set(),
            positive: new Set(),
        };
        domainInfo.preComputedScore = null;
        domainInfo = yield (0, exports.runPipeline)(domainInfo, handlers);
        console.log(domainInfo);
        const { highlights, score, htmlDetails } = (0, report_model_1.generateHighlights)(domainInfo);
        const scanResults = Object.assign({ highlights: {
                negative: [...highlights.negative],
                positive: [...highlights.positive],
            }, htmlDetails,
            score }, preData);
        return (0, report_helpers_1.removeEmpty)(scanResults);
    });
}
