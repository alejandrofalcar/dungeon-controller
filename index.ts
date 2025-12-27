import { Client, GatewayIntentBits, Collection, Events, ChatInputCommandInteraction } from "discord.js";
import { loadCommands } from "./utils/commandLoader.js";

interface Command {
  data: {
    name: string;
    toJSON: () => unknown;
  };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

client.commands = new Collection<string, Command>();

const token = process.env.DISCORD_BOT_TOKEN;

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`✅ Ready! Logged in as ${readyClient.user.tag}`);

  const commands = await loadCommands();
  commands.forEach((cmd) => {
    if (cmd.execute) {
      client.commands.set(cmd.data.name, cmd as Command);
    }
  });

  console.log(`📋 Commands loaded: ${client.commands.size}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`❌ No command matching ${interaction.commandName}`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    const errorMessage = {
      content: "There was an error executing this command!",
      ephemeral: true,
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(errorMessage);
    } else {
      await interaction.reply(errorMessage);
    }
  }
});

if (!token) {
  throw new Error("Missing DISCORD_BOT_TOKEN");
}

client.login(token);
