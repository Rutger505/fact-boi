import { Client, Events, type Interaction } from "discord.js";

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction) {
  // Check if the interaction is a button press

  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith("answer_")) {
    if (interaction.customId === "answer_correct") {
      await interaction.reply({
        content: "Correct answer! 🎉",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `Incorrect answer. ❌ The correct answer was: ${interaction.customId.replace(
          "answer_incorrect_",
          ""
        )}`,
        ephemeral: true,
      });
    }
    await interaction.message.delete();
  }
}
