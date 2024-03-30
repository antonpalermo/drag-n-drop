export type Character = {
  id: string;
  name: string;
  rankorder: string;
  originalorder: string;
};

export type SortablePayload = {
  upper?: Character | undefined;
  current: Character;
  lower?: Character | undefined;
};
