import path from "path";
import fs from "fs";
import readline from "readline";

const rankHashFn = (str: string) => {
  const targetPath = path.join(process.cwd(), "/data/rank/shards");
  const filename = str.slice(0, 2) + ".txt";
  return `${targetPath}/${filename}`;
};

/**
 * Extracts global rank of the website
 */
export const getGlobalRank = async (domainName: string): Promise<number> => {
  const filePath = rankHashFn(domainName);
  const fileStream = fs.createReadStream(filePath);
  const rank = 0; // O => not in top 1M
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    const parts = line.split(":");
    if (domainName === parts[0]) {
      return parseInt(parts[1]);
    }
  }
  return rank;
};
