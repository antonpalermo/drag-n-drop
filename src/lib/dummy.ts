type Characters = {
  id: number;
  name: string;
  [key: string]: any;
};

type Data = {
  characters: Characters[];
};

const dummy: Data = {
  characters: [],
};

export default dummy;
