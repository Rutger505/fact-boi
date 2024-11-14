import { ComponentType, Events, type Interaction } from "discord.js";

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction) {
  if (!interaction.isButton()) return;

  if (!interaction.customId.startsWith("answer_")) {
    return;
  }

  if (interaction.customId === "answer_correct") {
    await interaction.reply({
      content: "Correct answer! 🎉",
      ephemeral: true,
    });
  }

  const buttons = interaction.message.components[0].components.filter(
    (component) => component.type === ComponentType.Button
  );
  if (!buttons.length) {
    throw new Error("No buttons found in the message.");
  }

  const correctButton = buttons.find((button) =>
    button.customId.startsWith("answer_correct")
  );
  if (!correctButton) {
    throw new Error("Correct button not found.");
  }

  const correctAnswer = correctButton.label;
  if (!correctAnswer) {
    throw new Error("Correct answer not found.");
  }

  await interaction.reply({
    content: `Incorrect answer! The correct answer was ${correctAnswer}.`,
    ephemeral: true,
  });
}
