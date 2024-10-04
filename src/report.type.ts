import {
  HIGHLIGHT_LABELS_NEGATIVE,
  HIGHLIGHT_LABELS_POSITIVE,
} from "./report.constants";

type DomainInfo = {
  domainName: string;
  globalRank: number;
  doesAllowAnalyzeContent: boolean;
  isParkedDomain: boolean;
  redirectsTo: string;
  isKnownRegistrar: boolean;
  isDnsBlackListed: boolean;
  supportsHsts: boolean;
  hasFavIcon: boolean;
  domainAge: number;
  domainAgeReadable: boolean;
  sslState: string;
  supportsCSP: boolean;
  whoisHidden: boolean;
  implementsReferrerPolicy: boolean;
  loadsExternalObjects: boolean;
  isAbnormalUrl: boolean;
  isProtectedAgaintsClickJacking: boolean;
  isURLShortened: boolean;
  doesSupportHSTS: boolean;
  isProtectedAgainstXSS: boolean;
  doesLoadExternalObjects: boolean;
  preDefinedHighlights: {
    positive: Set<HIGHLIGHT_LABELS_POSITIVE>;
    negative: Set<HIGHLIGHT_LABELS_NEGATIVE>;
  };
  preComputedScore: number | null;
};

export default DomainInfo;
