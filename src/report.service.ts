import { report } from "process";
import DomainInfo from "./report.type";
import {
  HIGHLIGHT_LABELS_NEGATIVE,
  HIGHLIGHT_LABELS_POSITIVE,
} from "./report.constants";
import { getGlobalRank } from "./report.helpers";

// Step 1: Define a type for a function that takes input and returns the modified input.
type Func<T> = (domainInfo: DomainInfo) => void;

// Step 2: Create a pipeline function that takes an array of functions and applies them to the input.
const runPipeline = (domainInfo: DomainInfo, funcs: Func<DomainInfo>[]) => {
  // TODO: Type
};

function doesURLRedirect(domainInfo: DomainInfo) {
  // TODO:
}

function doesAllowAnalyzeContent(domainInfo: DomainInfo) {
  if (!domainInfo.doesAllowAnalyzeContent) {
    domainInfo.preDefinedHighlights.negative.add(
      HIGHLIGHT_LABELS_NEGATIVE.DOES_NOT_ALLOW_ANALYSE_CONTENT
    );
  }
}

async function globalRank(domainInfo: DomainInfo) {
  const globalRank = await getGlobalRank(domainInfo.domainName);
  domainInfo.globalRank = globalRank;

  const withinTop100k = globalRank > 0 && globalRank <= 200_000;
  const withinTop200k = globalRank > 0 && globalRank <= 200_000;
  const withinTop500k = globalRank > 0 && globalRank <= 500_000;
  const withinTop1m = globalRank != 0;

  // Optimizations : Check Guards
  if (withinTop1m) {
    domainInfo.isAbnormalUrl = false;
    domainInfo.preDefinedHighlights.positive.add(
      HIGHLIGHT_LABELS_POSITIVE.NOT_DNS_BLACKLISTED
    );
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
      HIGHLIGHT_LABELS_POSITIVE.IMPLEMENTS_REFERER_POLICY,
      HIGHLIGHT_LABELS_POSITIVE.SAFE_BY_GOOGLE_SAFE_BROWSING,
      HIGHLIGHT_LABELS_POSITIVE.SAFE_DNS_FILTER,
      HIGHLIGHT_LABELS_POSITIVE.RANKED_AMONG_TOP_5OOK,
      HIGHLIGHT_LABELS_POSITIVE.REGISTRAR_GOOD_REPUTATION,
      HIGHLIGHT_LABELS_POSITIVE.SUPPORTS_HSTS,
      HIGHLIGHT_LABELS_POSITIVE.IMPLEMENTS_REFERER_POLICY,
      HIGHLIGHT_LABELS_POSITIVE.PROTECTED_AGAINST_INJECTION,
    ].forEach((label) => {
      domainInfo.preDefinedHighlights.positive.add(label);
    });
    domainInfo.preComputedScore = 100;
  }

  if (withinTop200k) {
    domainInfo.doesLoadExternalObjects = false;
  }

  if (withinTop100k) {
    domainInfo.preDefinedHighlights.positive.delete(
      HIGHLIGHT_LABELS_POSITIVE.RANKED_AMONG_TOP_5OOK
    );
    domainInfo.preDefinedHighlights.positive.add(
      HIGHLIGHT_LABELS_POSITIVE.RANKED_AMONG_TOP_1OOK
    );
  }
}

const handlers: Func<DomainInfo>[] = [doesURLRedirect, doesAllowAnalyzeContent];
export default function (domainInfo: DomainInfo) {
  domainInfo.preDefinedHighlights = {
    negative: new Set(),
    positive: new Set(),
  };
  domainInfo.preComputedScore = null;

  runPipeline(domainInfo, handlers);
}
