import { Events, type Interaction } from "discord.js";

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
        content: `Incorrect answer. ❌ The correct answer was: ${interaction.message.components[0].components
          .find((c) => c.customId === "answer_correct")
          ?.label.replace("_", " ")}`,
        ephemeral: true,
      });
    }
    await interaction.message.delete();
  }
}