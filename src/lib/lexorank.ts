import { LexoDecimal, LexoRank } from "lexorank";
import LexoRankBucket from "lexorank/lib/lexoRank/lexoRankBucket";

export default class Lex extends LexoRank {
  constructor(bucket: LexoRankBucket, decimal: LexoDecimal) {
    super(bucket, decimal);
  }

  static assign(rank?: string) {
    let order = LexoRank.min().format();

    if (rank) {
      const currentRank = LexoRank.parse(rank);
      order = currentRank.genNext().format();
    }

    return order;
  }

  static reposition(source: string, destination: string) {
    const sourceRank = LexoRank.parse(source);
    return LexoRank.parse(destination).between(sourceRank).format();
  }
}
