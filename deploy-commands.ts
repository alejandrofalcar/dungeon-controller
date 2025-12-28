import { REST, Routes } from "discord.js";
import { loadCommands } from "./utils/commandLoader";

const deployCommands = async (): Promise<void> => {
	const token = process.env.DISCORD_BOT_TOKEN;
	const clientId = process.env.CLIENT_ID;

	if (!token || !clientId) {
		throw new Error("Missing DISCORD_BOT_TOKEN or CLIENT_ID");
	}

	const rest = new REST().setToken(token);

	try {
		const commands = await loadCommands();
		const commandData = commands.map((cmd) => cmd.data.toJSON());

		console.log(`🔄 Deploying ${commandData.length} commands...`);

		await rest.put(Routes.applicationCommands(clientId), { body: commandData });

		console.log("✅ Commands deployed successfully!");
	} catch (error) {
		console.error("❌ Error deploying commands:", error);
	}
};

deployCommands();
