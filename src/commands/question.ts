import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} from "discord.js";
import he from "he";
import { db, questions } from "../db";

const RATE_LIMIT_CODE = 5;

export const data = new SlashCommandBuilder()
  .setName("question")
  .setDescription("gives a one random question");

export async function execute(interaction: any) {
  const api = "https://opentdb.com/api.php?amount=1";

  // Fetch the API
  const response = await fetch(api);
  const data = await response.json();

  if (data.response_code === RATE_LIMIT_CODE) {
    await interaction.reply(
      "Please wait 5 seconds before sending another command."
    );
    return;
  }

  // Extract and structure the question and answers
  const questionData = data.results[0];
  const questionText = he.decode(questionData.question);
  const correctAnswer = he.decode(questionData.correct_answer);
  const answers = questionData.incorrect_answers
    .concat(questionData.correct_answer)
    .sort(() => Math.random() - 0.5)
    .map((answer: any) => he.decode(answer));

  const saveQuestionPromise = db
    .insert(questions)
    .values({
      category: questionData.category,
      type: questionData.type === "multiple" ? "multiple_choice" : "boolean",
      difficulty: questionData.difficulty as "easy" | "medium" | "hard",
      question: questionText,
      answers: answers,
      incorrectAnswers: questionData.incorrect_answers,
      correctAnswer: correctAnswer,
    })
    .onConflictDoNothing();

  // Create buttons for each answer
  const row = new ActionRowBuilder().addComponents(
    ...answers.map((answer: string) =>
      new ButtonBuilder()
        .setCustomId(
          answer === correctAnswer
            ? "answer_correct"
            : "answer_incorrect_" + answer.replace(" ", "_")
        )
        .setLabel(answer)
        // .setStyle(
        //   answer === correctAnswer ? ButtonStyle.Success : ButtonStyle.Primary
        // )
        .setStyle(ButtonStyle.Primary)
    )
  );

  // Send the question with answer buttons
  await interaction.reply({
    content: `Question: ${questionText}`,
    components: [row],
    fetchReply: true,
  });

  await saveQuestionPromise;
}
