import { Command, CommandOption, Config, FuncObj } from "./types.ts";
import { generate } from "./help.ts";

export function init(config: Config) {
  return new Tongs(config);
}

class Tongs {
  #name: string;
  #version: string;
  #help: string;
  #main: string;
  #subCommand: Command;
  #functions: FuncObj;

  constructor(config: Config) {
    this.#name = config.name;
    this.#version = config.version;
    this.#help = generate(config);
    this.#main = config.main;
    this.#subCommand = config.subCommand;
    this.#functions = {};
  }

  setFunc(funcObj: FuncObj): void {
    const funcName = Object.keys(funcObj)[0];
    const subCmd = this.#subCommand[funcName];

    if (this.#main !== funcName && !subCmd) {
      throw new Error("Not found function name.");
    }

    const [name, func] = Object.entries(funcObj)[0];
    this.#functions[name] = func;
  }

  #getFunction(name: string): Function {
    const func: Function | undefined = this.#functions[name];

    if (!func) {
      throw new Error("Not found function");
    }

    return func;
  }

  #getMainFunction(): Function {
    return this.#functions["main"];
  }

  #optionValidate(
    subCmd: string,
    options: Array<CommandOption>,
  ): boolean {
    const func = this.#subCommand[subCmd];
    if (typeof func === "string") {
      return false;
    }

    // If not has option, no check
    if (!func.options) {
      return true;
    }

    const optionKeys = options.map(({ key }) => key);
    const requiredKeys = func.options.filter((option) => option.param.required)
      .map((option) => option.args).flat();

    const hasKey = optionKeys.find((key) => requiredKeys.includes(key));
    if (!hasKey) return false;

    const optionValues = options.map(({ value }) => value);
    const requiredOptions = func.options.filter(({ param }) => param.required);

    return optionValues.length === requiredOptions.length;
  }

  #getOptionParams(args: Array<string>): Array<CommandOption> {
    let result = [];

    let keys = [];
    let values = [];

    // TODO: Process to check if it is an optional argument.
    for (const [index, arg] of args.entries()) {
      if (index === 0) continue;

      if (index % 2 === 1 && arg.startsWith("-") || arg.startsWith("--")) {
        keys.push(arg);
      } else {
        values.push(arg);
      }
    }

    if (keys.length !== values.length) {
      throw new Error("Invalid key and value");
    }

    for (const [index, key] of keys.entries()) {
      result.push({
        key,
        value: values[index],
      });
    }

    return result;
  }

  execute(args: any) {
    if (["-h", "--help", "help"].includes(args[0])) {
      console.log(this.#help);
      return;
    }

    if (["-v", "--version", "version"].includes(args[0])) {
      console.log(`${this.#name}: ${this.#version}`);
      return;
    }

    const subCmd: string = args.find((a: string) => this.#functions[a]);
    const subCommand = this.#subCommand[subCmd];

    let hasRequiredOption = false;
    if (subCommand && typeof subCommand === "object") {
      const requiredOptions = subCommand?.options?.filter(({ param }) =>
        param.required
      );
      hasRequiredOption = !!requiredOptions?.length;
    }

    const commandOptions = this.#getOptionParams(args);
    if (subCmd) {
      const func = this.#getFunction(subCmd);

      if (!!commandOptions.length || hasRequiredOption) {
        const isValid = this.#optionValidate(
          subCmd,
          commandOptions,
        );
        if (!isValid) {
          throw new Error("Invalid argument!");
        }
      }

      const values = commandOptions.map(({ value }) => value);
      func(...values);
    } else {
      this.#getMainFunction()();
    }
  }
}
