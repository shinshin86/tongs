export type Config = {
  name: string;
  version: string;
  main: string;
  subCommand: Command;
};

export type Command = {
  [keyof in string]: string | OptionalCommand;
};

export type FuncObj = {
  [keyof in string]: Function;
};

export type CommandOption = {
  key: string;
  value: string;
};

export type Setting = {
  name: string;
  version: string;
  main: string;
  subCommand?: {
    [keyof in string]: string | OptionalCommand;
  };
};

type OptionParam = {
  name: string;
  required: boolean;
};

type Argument = {
  args: Array<string>;
  param: OptionParam;
};

type OptionalCommand = {
  func: string;
  description?: string;
  options?: Array<Argument>;
};
