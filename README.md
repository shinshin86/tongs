# Tongs

A lightweight and simple command line parser for Deno.\
It is mainly used to create CLI tools with subcommands.

## Yet experimental project

This project is still in the experimental stage.\
Please note that breaking changes are likely to come in the future.

## Usage

```typescript
// exmaple.ts
import { init } from "./mod.ts";

const usageText = `USAGE:
    app <SUBCOMMAND> [OPTIONS]
  FLAGS:
    -h, --help, help: Prints help information
    -v, --version, version: Prints version information
  SUBCOMMANDS:
    foo foo command
    bar bar command (REQUIRED OPTIONS: -t, --text <text>)
    baz baz command (REQUIRED OPTIONS: -t, --text <text> && -n --number <number>)`;

// tongs setting
const tongSetting = {
  name: "app",
  version: "1.0.0",
  help: usageText, // Help text is here
  main: "main", // The function foo will be called
  subCommand: {
    foo: "foo", // The function foo will be called
    bar: {
      funcName: "bar", // The function bar will be called
      options: [
        {
          args: ["-t", "--text"],
          param: { name: "text", required: true },
        },
      ],
    },
    baz: {
      funcName: "baz", // The function baz will be called
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

// run
tongs.execute(Deno.args);
```

Run cli app.

```sh
# main
deno run example.ts
# => main

# help
deno run example.ts -h # or --help or help
# => help

# version
deno run example.ts -v # or --version or version
# => version

# foo
deno run example.ts foo
# => foo

# bar 
deno run example.ts bar
# => bar: default value

# bar -t <text>
deno run example.ts bar -t testvalue # --text testvalue
# => bar: testvalue

# bar -n <number>
deno run example.ts bar -n 123 # --number 123
# => throw error

# baz -t <text> -n <number>
deno run example.ts baz -t testvalue -n 123
# or: deno run example.ts baz --text testvalue --number 123
# => baz: testvalue & 123

# baz -t <text> => error
deno run example.ts baz -t testvalue
# => throw error
```