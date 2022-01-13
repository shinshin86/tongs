import { assert, assertEquals } from "https://deno.land/std/testing/asserts.ts";

const basicCmd = [
  "deno",
  "run",
  "./test/app.ts",
];

const getStdoutResult = (rawOutput: Uint8Array): string => {
  return new TextDecoder().decode(rawOutput).trim();
};

const helpResult = `app: 1.0.0

USAGE:
  app [OPTIONS] [SUBCOMMAND]

OPTIONS:
  -h, --help help  Prints help information
  -v, --version version  Prints version information

SUBCOMMANDS
  foo
  bar bar command (REQUIRED OPTIONS: -t, --text: text)
  baz baz command (REQUIRED OPTIONS: -t, --text: text && -n, --number: num)`;

Deno.test({
  name: "tongs[Shell execution test]: main",
  fn: async () => {
    const p = Deno.run({
      cmd: basicCmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);

    assertEquals(stdoutResult, "main");

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: -h",
  fn: async () => {
    const cmd = basicCmd.concat("-h");

    const p = Deno.run({
      cmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);

    assertEquals(stdoutResult, helpResult);

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: --help",
  fn: async () => {
    const cmd = basicCmd.concat("--help");

    const p = Deno.run({
      cmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);

    assertEquals(stdoutResult, helpResult);

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: help",
  fn: async () => {
    const cmd = basicCmd.concat("help");

    const p = Deno.run({
      cmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);
    assertEquals(stdoutResult, helpResult);

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: -v",
  fn: async () => {
    const cmd = basicCmd.concat("-v");

    const p = Deno.run({
      cmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);

    assertEquals(stdoutResult, "app: 1.0.0");

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: --version",
  fn: async () => {
    const cmd = basicCmd.concat("--version");

    const p = Deno.run({
      cmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);

    assertEquals(stdoutResult, "app: 1.0.0");

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: version",
  fn: async () => {
    const cmd = basicCmd.concat("version");

    const p = Deno.run({
      cmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);

    assertEquals(stdoutResult, "app: 1.0.0");

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: foo",
  fn: async () => {
    const cmd = basicCmd.concat("foo");

    const p = Deno.run({
      cmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);

    assertEquals(stdoutResult, "foo");

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: bar",
  fn: async () => {
    const cmd = basicCmd.concat("bar");

    const p = Deno.run({
      cmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);

    assertEquals(stdoutResult, "bar: default value");

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: bar -t testvalue",
  fn: async () => {
    const cmd = basicCmd.concat(["bar", "-t", "testvalue"]);

    const p = Deno.run({
      cmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);

    assertEquals(stdoutResult, "bar: testvalue");

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: bar -n 123",
  fn: async () => {
    const cmd = basicCmd.concat(["bar", "-n", "123"]);

    const p = Deno.run({
      cmd,
      stderr: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 1);

    const rawError = await p.stderrOutput();
    const stdoutResult = getStdoutResult(rawError);

    assert(stdoutResult.includes("Uncaught Error: Invalid argument"));
    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: baz -t testvalue -n 123",
  fn: async () => {
    const cmd = basicCmd.concat(["baz", "-t", "testvalue", "-n", "123"]);

    const p = Deno.run({
      cmd,
      stdout: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 0);

    const rawOutput = await p.output();
    const stdoutResult = getStdoutResult(rawOutput);

    assertEquals(stdoutResult, "baz: testvalue & 123");

    await p.close();
  },
});

Deno.test({
  name: "tongs[Shell execution test]: baz -t testvalue",
  fn: async () => {
    const cmd = basicCmd.concat(["baz", "-t", "testvalue"]);

    const p = Deno.run({
      cmd,
      stderr: "piped",
    });

    const { code } = await p.status();
    assertEquals(code, 1);

    const rawError = await p.stderrOutput();
    const stdoutResult = getStdoutResult(rawError);

    assert(stdoutResult.includes("Uncaught Error: Invalid argument"));
    await p.close();
  },
});
