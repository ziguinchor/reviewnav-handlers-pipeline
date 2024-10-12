"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHighlights = void 0;
const report_constants_1 = require("./report.constants");
const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;
const TWO_YEARS = ONE_YEAR * 2;
const FIVE_YEARS = ONE_YEAR * 5;
const SEVEN_YEARS = ONE_YEAR * 7;
const computeScore = (domainInfo) => {
    let currentScore = report_constants_1.BASE_SCORE;
    //console.log(domainInfo);
    const { domainName, globalRank, domainAge, sslState, isParkedDomain } = domainInfo;
    if (globalRank > 0 && globalRank <= 50000)
        return 100;
    if (domainAge < TWO_YEARS)
        currentScore -= report_constants_1.BASE_SCORE * 0.5;
    else if (domainAge < FIVE_YEARS)
        currentScore += report_constants_1.BASE_SCORE * 0.5;
    else if (domainAge >= FIVE_YEARS && domainAge < SEVEN_YEARS)
        currentScore += report_constants_1.BASE_SCORE * 0.6;
    else if (domainAge >= SEVEN_YEARS)
        currentScore += report_constants_1.BASE_SCORE * 0.9;
    if (globalRank != 0)
        currentScore += report_constants_1.BASE_SCORE * report_constants_1.PROPERTY_SCORE_WEIGHTAGE.DOMAIN_AGE;
    if (sslState === null || sslState === void 0 ? void 0 : sslState.valid)
        currentScore += report_constants_1.BASE_SCORE * report_constants_1.PROPERTY_SCORE_WEIGHTAGE.SSL_VALID;
    else
        currentScore -= report_constants_1.BASE_SCORE * report_constants_1.PROPERTY_SCORE_WEIGHTAGE.SSL_VALID;
    if (isParkedDomain)
        currentScore -= report_constants_1.BASE_SCORE * report_constants_1.PROPERTY_SCORE_WEIGHTAGE.DOMAINE_PARKED;
    if (currentScore <= 89) {
        currentScore += domainName.charCodeAt(0) % 11;
    }
    if (currentScore >= 100)
        return 100;
    domainInfo.preComputedScore = currentScore;
};
const getDomainAgeHighlights = (domaineInfo) => {
    let p = "";
    const { domainAge } = domaineInfo;
    const output = {};
    if (domainAge < ONE_YEAR) {
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.DOMAIN_AGE_VERY_YOUNG;
        p =
            "The domain registration for this website is relatively recent, and we advise exercising caution when purchasing or utilizing services from such a newly established site. It's noteworthy that websites associated with scams often have short lifespans, lasting only a few months before being deactivated. However, an older website doesn't necessarily guarantee safety, as some fraudulent sites can endure for years. Typically, most scam sites are dismantled within a few months due to an increase in consumer complaints, leading hosting companies to respond to numerous emails and phone calls.";
    }
    else if (domainAge < TWO_YEARS) {
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.DOMAIN_AGE_VERY_YOUNG;
        p =
            "The website owner has extended the domain registration for a period exceeding one year, indicating a commitment to maintaining the website for the foreseeable future. This decision has led to an elevation in the Trust Score for earthchoicesupply.com. This action is significant, as many scammers typically avoid renewing their domain names once their fraudulent activities become publicly known.";
    }
    else if (domainAge < FIVE_YEARS) {
        output.positiveHighlight = report_constants_1.HIGHLIGHT_LABELS_POSITIVE.DOMAIN_AGE_SOME_YEARS;
        p =
            "Through our investigation, we've found that the domain for this website was registered just a few years ago. While scam websites are generally newly established, it's essential to exercise caution. In the current landscape, scammers may also acquire old and existing websites for their malicious activities. Therefore, it remains vital to thoroughly assess the website for any other signals of potential scams.";
    }
    else if (domainAge >= FIVE_YEARS && domainAge < SEVEN_YEARS) {
        output.positiveHighlight = report_constants_1.HIGHLIGHT_LABELS_POSITIVE.DOMAIN_AGE_SOME_YEARS;
        p =
            "Upon investigation, it came to our attention that the domain for this website was registered several years ago. It's noteworthy that scam websites typically tend to be quite new. However, caution is advised, as contemporary scammers may also acquire old and existing websites to initiate their malpractices. Therefore, it is crucial to conduct a comprehensive examination of the website for any other indicators of potential scams.";
    }
    else if (domainAge >= SEVEN_YEARS) {
        output.positiveHighlight = report_constants_1.HIGHLIGHT_LABELS_POSITIVE.DOMAIN_AGE_OLD;
        p =
            "The establishment of this website dates back several years, which we view as a positive indicator. Generally, the longer a website has been in existence, the more likely it is to be legitimate. Nevertheless, the age of the website does not serve as an absolute guarantee. Instances have been reported where scammers acquire existing domain names to initiate their malicious activities. Hence, it remains imperative to conduct thorough checks on websites as a precautionary measure.";
    }
    output.details = {
        type: "detailedAnalysis",
        p,
    };
    return output;
};
const getDomainRankHighlights = (domaineInfo) => {
    const output = {};
    const { globalRank } = domaineInfo;
    if (globalRank === 0) {
    }
    else if (globalRank < 500000) {
        output.positiveHighlight = report_constants_1.HIGHLIGHT_LABELS_POSITIVE.RANKED_AMONG_TOP_1OOK;
    }
    else if (globalRank >= 500000) {
        output.positiveHighlight = report_constants_1.HIGHLIGHT_LABELS_POSITIVE.RANKED_AMONG_TOP_5OOK;
    }
    return output;
};
// Affect score
const getSslHighlights = (domainInfo) => {
    const output = {};
    const { sslState } = domainInfo;
    const negativeMessage = "We couldn't locate a valid SSL certificate, and this is particularly worrisome for professional online stores. A reliable SSL certificate is a crucial element for ensuring secure communication between your browser and the website. While the significance of an SSL certificate may be somewhat less for smaller blogs or content sites, we recommend its implementation for a more robust and secure online experience.";
    const positiveMessage = "We have successfully identified a valid SSL certificate, which is especially reassuring for professional online stores. A reliable SSL certificate plays a vital role in ensuring secure communication between your browser and the website. While the necessity of an SSL certificate may be somewhat reduced for smaller blogs or content sites, we still recommend its implementation for an enhanced and secure online experience.";
    if (sslState === null || sslState === void 0 ? void 0 : sslState.valid) {
        output.positiveHighlight = report_constants_1.HIGHLIGHT_LABELS_POSITIVE.SSL_VALID;
        output.details = {
            type: "technicalAnalysis",
            p: positiveMessage,
        };
    }
    else if (sslState === null || sslState === void 0 ? void 0 : sslState.error) {
        output.negativeHighlight = `Invalid SSL Certificate with error ${(sslState === null || sslState === void 0 ? void 0 : sslState.error) || sslState}`;
        output.details = {
            type: "technicalAnalysis",
            p: negativeMessage,
        };
    }
    else {
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.NO_SSL_CERT_FOUND;
        output.details = {
            type: "technicalAnalysis",
            p: negativeMessage,
        };
    }
    return output;
};
const getRegistrarHighlights = (domainInfo) => {
    const output = {};
    const { isKnownRegistrar, globalRank } = domainInfo;
    if (isKnownRegistrar || globalRank != 0) {
        output.positiveHighlight =
            report_constants_1.HIGHLIGHT_LABELS_POSITIVE.REGISTRAR_GOOD_REPUTATION;
        output.details = {
            type: "technicalAnalysis",
            p: "The website's domain registration is facilitated by a reputable and well-known registrar, or domain registration company. Registrars vary in their reputation and practices, the website has chosen a recognized registrar, contributing to an elevated Trust Score.",
        };
    }
    else
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.REGISTRAR_UNKNOWN;
    return output;
};
const getUrlShortenedHighlights = ({ isUrlShortened, }) => {
    const output = {};
    if (isUrlShortened) {
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.URL_SHORTENED;
    }
    return output;
};
const getHstsSupportHighlights = (domainInfo) => {
    const { doesSupportHSTS, globalRank } = domainInfo;
    const output = {};
    if (doesSupportHSTS || globalRank != 0) {
        output.positiveHighlight = report_constants_1.HIGHLIGHT_LABELS_POSITIVE.SUPPORTS_HSTS;
    }
    return output;
};
const getUrlRedirectsHighlights = (domainInfo) => {
    const { redirectsTo, globalRank } = domainInfo;
    if (globalRank >= 0 && globalRank <= 500000)
        return {};
    const output = {};
    if (redirectsTo) {
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.URL_REDIRECTS;
    }
    return output;
};
const getUrlTooLongHighlights = (domainInfo) => {
    const { urlTooLong, globalRank } = domainInfo;
    if (globalRank != 0)
        return {};
    const output = {};
    if (urlTooLong) {
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.URL_TOO_LONG;
    }
    return output;
};
const getUrlLoadsExtenalObjectsHighlights = (domainInfo) => {
    const { doesLoadExternalObjects, globalRank } = domainInfo;
    if (globalRank > 0 && globalRank <= 200000)
        return {};
    const output = {};
    if (doesLoadExternalObjects && globalRank != 0) {
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.LOADS_EXTERNAL_OBJECTS;
    }
    return output;
};
const getReferrerPolicyHighlights = (domainInfo) => {
    const output = {};
    const { implementsReferrerPolicy, globalRank } = domainInfo;
    if (implementsReferrerPolicy || globalRank != 0) {
        output.positiveHighlight =
            report_constants_1.HIGHLIGHT_LABELS_POSITIVE.IMPLEMENTS_REFERER_POLICY;
    }
    else {
        output.negativeHighlight =
            report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.DOES_NOT_IMPLEMENT_REFERER_POLICY;
    }
    return output;
};
const getCspSupportHighlights = (domainInfo) => {
    const { supportsCSP, globalRank } = domainInfo;
    if (globalRank > 0 && globalRank <= 200000)
        return {};
    const output = {};
    if (supportsCSP) {
        output.positiveHighlight =
            report_constants_1.HIGHLIGHT_LABELS_POSITIVE.PROTECTED_AGAINST_INJECTION;
    }
    else {
        output.negativeHighlight =
            report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.NOT_PROTECTED_AGAINST_INJECTION;
    }
    return output;
};
const getParkedDomainHighlights = (domainInfo) => {
    const output = {};
    const { isParkedDomain } = domainInfo;
    if (isParkedDomain) {
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.DOMAIN_PARKED;
        output.details = {
            type: "companyEvaluation",
            p: 'The website seems to be in a "parked" state at the moment, suggesting that the owner is no longer using it actively. It might have been active the last time you visited.',
        };
    }
    return output;
};
const getIsAbnormalUrlHighlights = (domainInfo) => {
    const { isAbnormalUrl, globalRank } = domainInfo;
    if (globalRank > 0 && globalRank <= 400000)
        return {};
    const output = {};
    if (typeof isAbnormalUrl !== undefined && !isAbnormalUrl) {
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.URL_ABNORMAL;
    }
    return output;
};
const getDnsBlHighlights = (domainInfo) => {
    const output = {};
    const { isDnsBlackListed, globalRank } = domainInfo;
    if (isDnsBlackListed && globalRank === 0) {
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.DNS_BLACK_LISTED;
        output.details = {
            type: "technicalAnalysis",
            p: `the server IP address is listed in one or more Spam Database, Being listed with a DNSBL does not always indicate the IP address is a source of spam. Some DNSBL's criteria are based of the IP address' country or connection type. If you are listed with a DNSBL click on the link for removal criteria.`,
        };
    }
    else
        output.positiveHighlight = report_constants_1.HIGHLIGHT_LABELS_POSITIVE.NOT_DNS_BLACKLISTED;
    return output;
};
const getWhoisHiddenHighlights = (domainInfo) => {
    const output = {};
    if (domainInfo.whoisHidden) {
        output.details = {
            type: "companyEvaluation",
            p: "We see that the owner of the website is using a service to hide his/her identity. This may be because the owner does not want to get spammed. However, it also makes it difficult to identify the real owner of the website. As a result, websites hiding their identity get a slightly lower score.",
        };
        output.negativeHighlight = report_constants_1.HIGHLIGHT_LABELS_NEGATIVE.DOES_HIDE_WHOIS;
    }
    return output;
};
const generateHighlights = (domainInfo) => {
    let currentTrustScore = report_constants_1.BASE_SCORE;
    const highlights = {
        positive: new Set(),
        negative: new Set(),
    };
    let htmlDetails = {
        companyEvaluation: [],
        technicalAnalysis: [],
        detailedAnalysis: [],
    };
    deriversFnMap.forEach((deriver) => {
        const { score = currentTrustScore, positiveHighlight, negativeHighlight, details, } = deriver.call({}, domainInfo);
        currentTrustScore = score;
        if (details) {
            // @ts-ignore
            htmlDetails[details.type].push(`${details.p}`);
        }
        positiveHighlight &&
            highlights.positive.add(positiveHighlight);
        negativeHighlight &&
            highlights.negative.add(negativeHighlight);
    });
    return {
        highlights,
        // @ts-ignore
        score: computeScore(domainInfo),
        htmlDetails,
    };
};
exports.generateHighlights = generateHighlights;
const deriversFnMap = [
    getDomainRankHighlights,
    getDomainAgeHighlights,
    getRegistrarHighlights,
    getSslHighlights,
    // UrlShortenedScore,
    getHstsSupportHighlights,
    // IpPresentScore,
    getUrlRedirectsHighlights,
    getUrlTooLongHighlights,
    // getUrlTooDeepHighlights,
    // hasFaviconScore,
    // getUrlHasAltSignHighlights,
    getUrlLoadsExtenalObjectsHighlights,
    getReferrerPolicyHighlights,
    getCspSupportHighlights,
    getParkedDomainHighlights,
    // getIsAbnormalUrlHighlights,
    getWhoisHiddenHighlights,
    getDnsBlHighlights,
];
