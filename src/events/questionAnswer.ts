import {
  ButtonInteraction,
  ComponentType,
  Events,
  type Interaction,
} from "discord.js";
import { db, userAnswers, users } from "../db";

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction: Interaction) {
  if (!interaction.isButton()) {
    return;
  }
  if (interaction.component.type !== ComponentType.Button) {
    return;
  }
  if (!("label" in interaction.component)) {
    return;
  }
  if (!interaction.customId.startsWith("answer_")) {
    return;
  }

  console.log(interaction.message.id);
  console.log(interaction.user.id);

  const isCorrectAnswer = interaction.customId === "answer_correct";
  const correctAnswer = findCorrectAnswer(interaction);
  const userAnswer = interaction.component.label;

  await interaction.reply({
    content: isCorrectAnswer
      ? "Correct answer! 🎉"
      : `Incorrect answer! 😢 The correct answer was ${correctAnswer}.`,
    ephemeral: true,
  });

  // await saveAnswerToDatabase({
  //     userId: interaction.user.id,
  //
  //   });

  await db
    .insert(users)
    .values({
      id: interaction.user.id as unknown as number, // TODO fix
      displayName: interaction.user.displayName,
    })
    .onConflictDoNothing();

  await db.insert(userAnswers).values({
    userId: interaction.user.id as unknown as number,
    questionId: interaction.message.id as unknown as number,
    answer: userAnswer,
    isCorrect: isCorrectAnswer,
  });

  await interaction.message.delete();
}

async function saveAnswerToDatabase({
  userId,
  questionId,
  answer,
  isCorrect,
}: {
  userId: string;
  questionId: number;
  answer: string;
  isCorrect: boolean;
}) {
  // First, ensure user exists in database
  await db
    .insert(users)
    .values({
      id: userId,
      displayName: "Unknown", // You might want to get this from Discord
    })
    .onConflictDoNothing();

  // Then save the answer
  await db.insert(userAnswers).values({
    id: Date.now(), // You might want a better ID generation strategy
    userId: BigInt(userId),
    questionId,
    answer,
    isCorrect,
  });
}

function findCorrectAnswer(interaction: ButtonInteraction) {
  const buttons = interaction.message.components[0].components.filter(
    (component) => component.type === ComponentType.Button
  );
  if (!buttons.length) {
    throw new Error("No buttons found in the message.");
  }

  const correctButton = buttons.find((button) =>
    button.customId?.startsWith("answer_correct")
  );
  if (!correctButton) {
    throw new Error("Correct button not found.");
  }

  const correctAnswer = correctButton.label;
  if (!correctAnswer) {
    throw new Error("Correct answer not found.");
  }
  return correctAnswer;
}
