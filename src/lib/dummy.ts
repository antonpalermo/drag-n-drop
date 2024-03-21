type Characters = {
  id: string;
  name: string;
  rankorder: string;
  [key: string]: any;
};

type Data = {
  characters: Characters[];
};

const dummy: Data = {
  characters: [],
};

export default dummy;
