type Characters = {
  id: number;
  name: string;
  order: string;
  [key: string]: any;
};

type Data = {
  characters: Characters[];
};

const dummy: Data = {
  characters: [],
};

export default dummy;
