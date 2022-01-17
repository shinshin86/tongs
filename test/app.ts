import { init } from "../mod.ts";

// tongs setting
const tongSetting = {
  name: "app",
  version: "1.0.0",
  main: "main", // The function foo will be called
  subCommand: {
    foo: "foo", // The function foo will be called
    bar: {
      funcName: "bar", // The function bar will be called
      description: "bar command",
      options: [
        {
          args: ["-t", "--text"],
          param: { name: "text", required: true },
        },
      ],
    },
    baz: {
      funcName: "baz", // The function baz will be called
      description: "baz command",
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
      funcName: "bar", // The function baz will be called
      description: "Functions with optional arguments",
      options: [
        {
          args: ["-t", "--text"],
          param: { name: "text", required: false },
        },
      ],
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

function bar(text: string | undefined) {
  const value = text || "default value";
  console.log(`bar: ${value}`);
}
tongs.setFunc({ bar });

function baz(text: string, num: number) {
  console.log(`baz: ${text} & ${num}`);
}
tongs.setFunc({ baz });

tongs.setFunc({ funcOptionalArgument1: bar });

// run
tongs.execute(Deno.args);
