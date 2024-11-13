import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("questiontest")
  .setDescription("gives a test response");

export async function execute(interaction: any) {
  await interaction.reply("This is a test response");
}
