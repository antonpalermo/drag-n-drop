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
  const { upper, entity, lower } = payload;

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
    lex = LexoRank.parse(entity.rankorder).genNext();
  }

  return lex;
}

function createSortablePayloadByIndex(items: any, event: DragEndEvent) {
  const { active, over } = event;
  const oldIndex = items.findIndex((x: any) => x.id === active.id);
  const newIndex = items.findIndex((x: any) => x.id === over?.id);
  let input;
  const entity = items[oldIndex];
  if (newIndex === 0) {
    const nextEntity = items[newIndex];
    input = { prevEntity: undefined, entity: entity, nextEntity: nextEntity };
  } else if (newIndex === items.length - 1) {
    const prevEntity = items[newIndex];
    input = { prevEntity: prevEntity, entity: entity, nextEntity: undefined };
  } else {
    const prevEntity = items[newIndex];
    const offset = oldIndex > newIndex ? -1 : 1;
    const nextEntity = items[newIndex + offset];
    input = { prevEntity: prevEntity, entity: entity, nextEntity: nextEntity };
  }

  return input;
}

export default { sortListAsc, getRankInBetween, createSortablePayloadByIndex };
