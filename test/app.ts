import { init } from "../mod.ts";

// tongs setting
const tongSetting = {
  name: "app",
  version: "1.0.0",
  main: "main",
  subCommand: {
    foo: "foo",
    funcRequiredArgument1: {
      func: "funcRequiredArgument1",
      description: "Functions with required arguments 1",
      options: [
        {
          args: ["-t", "--text"],
          param: { name: "text", required: true },
        },
      ],
    },
    funcRequiredArgument2: {
      func: "funcRequiredArgument2",
      description: "Functions with required arguments 2",
      options: [
        {
          args: ["-t", "--text"],
          param: { name: "text", required: true },
        },
        {
          args: ["-n", "--number"],
          param: { name: "num", required: true },
        },
      ],
    },
    funcOptionalArgument1: {
      func: "funcOptionalArgument1",
      description: "Functions with optional arguments",
      options: [
        {
          args: ["-t", "--text"],
          param: { name: "text", required: false },
        },
      ],
    },
    bar: {
      func: "funcOptionalArgument1",
      description:
        "The actual name is funcOptionalArgument1, but the subcommand name is different",
    },
  },
};

// Initialize
const tongs = init(tongSetting);

function main() {
  console.log("main");
}

tongs.setFunc({ main });

function foo() {
  console.log("foo");
}

tongs.setFunc({ foo });

function funcRequiredArgument1(text: string) {
  console.log(`funcRequiredArgument1: ${text}`);
}

tongs.setFunc({ funcRequiredArgument1 });

function funcRequiredArgument2(text: string, num: number) {
  console.log(`funcRequiredArgument2: ${text} & ${num}`);
}

tongs.setFunc({ funcRequiredArgument2 });

function funcOptionalArgument1(text: string | undefined) {
  const value = text || "default value";
  console.log(`funcOptionalArgument1: ${value}`);
}

tongs.setFunc({ funcOptionalArgument1 });

// The actual name is funcOptionalArgument1, but the subcommand name is different.
tongs.setFunc({ bar: funcOptionalArgument1 });

// run
tongs.execute(Deno.args);
