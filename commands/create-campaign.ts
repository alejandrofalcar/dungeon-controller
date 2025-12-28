import {
	ApplicationIntegrationType,
	type ChatInputCommandInteraction,
	InteractionContextType,
	SlashCommandBuilder,
} from "discord.js";

export const data = new SlashCommandBuilder()
	.setName("create-campaign")
	.setDescription("Replies with your input!")
	.setContexts(InteractionContextType.BotDM)
	.setIntegrationTypes(ApplicationIntegrationType.UserInstall)
	.addStringOption((option) =>
		option
			.setName("input")
			.setDescription("The input to echo back")
			.setRequired(true),
	);

export async function execute(
	interaction: ChatInputCommandInteraction,
): Promise<void> {
	const input = interaction.options.getString("input", true);
	await interaction.reply(`You entered: ${input}`);
}
