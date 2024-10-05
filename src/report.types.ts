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
  sslState: {
    valid: boolean;
    error?: string;
  };
  supportsCSP: boolean;
  whoisHidden: boolean;
  implementsReferrerPolicy: boolean;
  loadsExternalObjects: boolean;
  isAbnormalUrl: boolean;
  urlTooLong: boolean;
  isProtectedAgaintsClickJacking: boolean;
  isUrlShortened: boolean;
  doesSupportHSTS: boolean;
  isProtectedAgainstXSS: boolean;
  doesLoadExternalObjects: boolean;
  preDefinedHighlights: Highlights;
  highlights: Highlights;
  preComputedScore: number | null;
};

export type Highlights = {
  positive: Set<HIGHLIGHT_LABELS_POSITIVE>;
  negative: Set<HIGHLIGHT_LABELS_NEGATIVE>;
};

export default DomainInfo;
