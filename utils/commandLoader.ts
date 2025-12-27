import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Command {
  data: {
    name: string;
    toJSON: () => RESTPostAPIApplicationCommandsJSONBody;
  };
  execute?: (interaction: unknown) => Promise<void>;
}

export async function loadCommands(): Promise<Command[]> {
  const commands: Command[] = [];
  const commandsPath = path.join(__dirname, "../commands");
  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(filePath);
    const command: Command = commandModule.default || commandModule;

    if (command.data) {
      commands.push(command);
      console.log(`✅ Loaded: ${command.data.name}`);
    } else {
      console.log(`⚠️ Warning: ${file} is missing "data"`);
    }
  }

  return commands;
}
