# Tongs

[![Deno CI](https://github.com/shinshin86/tongs/actions/workflows/main.yml/badge.svg)](https://github.com/shinshin86/tongs/actions/workflows/main.yml)

A lightweight and simple command line parser for Deno.\
It is mainly used to create CLI tools with subcommands.

## Yet experimental project

This project is still in the experimental stage.\
Please note that breaking changes are likely to come in the future.

## Usage

```typescript
// app.ts
import { init } from "https://deno.land/x/tongs@v0.0.4/mod.ts";

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
```

Run cli app.

```sh
# main
deno run app.ts
# => main

deno run app.ts -h
deno run app.ts --help
deno run app.ts help

#app: 1.0.0
#
#USAGE:
#  app [OPTIONS] [SUBCOMMAND]

#OPTIONS:
#  -h, --help help  Prints help information
#  -v, --version version  Prints version information

#SUBCOMMANDS
#  foo
#  funcRequiredArgument1: Functions with required arguments 1 (REQUIRED OPTIONS: -t, --text: text)
#  funcRequiredArgument2: Functions with required arguments 2 (REQUIRED OPTIONS: -t, --text: text && -n, --number: num)
#  funcOptionalArgument1: Functions with optional arguments (-t, --text: text)
#  bar: The actual name is funcOptionalArgument1, but the subcommand name is different

deno run app.ts -v
deno run app.ts --version
deno run app.ts version
# => app: 1.0.0

deno run app.ts foo
# => foo

deno run app.ts funcRequiredArgument1
# => throw error

deno run app.ts funcRequiredArgument1 -t testvalue
# => funcRequiredArgument1: testvalue

deno run app.ts funcRequiredArgument1 -n 123
# => throw error

deno run app.ts funcRequiredArgument2 -t testvalue -n 123
# => funcRequiredArgument2: testvalue & 123

deno run app.ts funcRequiredArgument2
# => throw error

deno run app.ts funcRequiredArgument2 -t testvalue
# => throw error

deno run app.ts funcRequiredArgument2 -n 123
# => throw error

deno run app.ts funcOptionalArgument1
# => funcOptionalArgument1: default value

deno run app.ts funcOptionalArgument1 -t testvalue
# => funcOptionalArgument1: testvalue

deno run app.ts funcOptionalArgument1 -n 123
# => throw error

deno run app.ts bar
# => funcOptionalArgument1: default value

deno run app.ts bar -t testvalue
# => throw error

deno run app.ts bar -n 123
# => throw error
```

## test

```sh
deno test --allow-run
```

## Licence

[MIT](https://github.com/shinshin86/tongs/blob/main/LICENSE)

## Author

[Yuki Shindo](https://shinshin86.com/en)
