import { LexoRank } from "lexorank";
import { DragEndEvent } from "@dnd-kit/core";

import { Character, SortablePayload } from "./list.type";

function sortListAsc(a: Character, b: Character): number {
  if (a.rankorder && !b.rankorder) return 1;
  if (!a.rankorder && b.rankorder) return -1;
  if (!a.rankorder && !b.rankorder) return 0;

  return a.rankorder.localeCompare(b.rankorder);
}

function getRankInBetween(payload: SortablePayload): LexoRank {
  const { upper, current, lower } = payload;

  let lex: LexoRank;

  if (!upper && !!lower) {
    lex = LexoRank.parse(lower.rankorder).genPrev();
  } else if (!!upper && !lower) {
    lex = LexoRank.parse(upper.rankorder).genNext();
  } else if (!!upper && !!lower) {
    lex = LexoRank.parse(lower.rankorder).between(
      LexoRank.parse(upper.rankorder)
    );
  } else {
    lex = LexoRank.parse(current.rankorder).genNext();
  }

  return lex;
}

function createSortablePayloadByIndex<TEntity extends Character>(
  items: TEntity[],
  event: DragEndEvent
): SortablePayload {
  const { active, over } = event;

  const oldIndex = items.findIndex((x: any) => x.id === active.id);
  const newIndex = items.findIndex((x: any) => x.id === over?.id);

  let input: SortablePayload;

  if (newIndex === 0) {
    input = {
      upper: undefined,
      current: items[oldIndex],
      lower: items[newIndex],
    };
  } else if (newIndex === items.length - 1) {
    input = {
      upper: items[newIndex],
      current: items[oldIndex],
      lower: undefined,
    };
  } else {
    const offset = oldIndex > newIndex ? -1 : 1;
    input = {
      upper: items[newIndex],
      current: items[oldIndex],
      lower: items[newIndex + offset],
    };
  }

  return input;
}

export default { sortListAsc, getRankInBetween, createSortablePayloadByIndex };
