import { Setting } from "./types.ts";

export function generate(setting: Setting): string {
  const hasSubCommand = setting.subCommand &&
    !!Object.keys(setting.subCommand).length;

  let usageText = `${setting.name}: ${setting.version}

USAGE:
  ${setting.name} [OPTIONS] ${hasSubCommand && "[SUBCOMMAND]"}

OPTIONS:
  -h, --help help  Prints help information
  -v, --version version  Prints version information`;

  if (!!hasSubCommand && !!setting?.subCommand) {
    usageText += `

SUBCOMMANDS`;

    for (const command of Object.keys(setting.subCommand)) {
      const subCmd = setting.subCommand[command];
      if (typeof subCmd === "string") {
        usageText += `
  ${command}`;
      } else {
        usageText += `
  ${command}: ${subCmd.description}`;

        if (!!subCmd.options?.length) {
          let isRequired = false;

          usageText += ` (`;

          for (const [index, opt] of Object.entries(subCmd.options)) {
            if (opt.param.required) {
              isRequired = true;
            }

            if (Number(index) > 0) usageText += " && ";

            usageText += `${
              Number(index) === 0 && isRequired ? "REQUIRED OPTIONS: " : ""
            }${opt.args.join(", ")}: ${opt.param.name}`;
          }

          usageText += ")";
        }
      }
    }
  }

  return usageText;
}
