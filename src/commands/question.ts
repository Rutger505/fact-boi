import {
  ActionRowBuilder,
  ButtonBuilder,
  SlashCommandBuilder,
  ButtonStyle,
  Events,
} from "discord.js";
import he from "he";

export const data = new SlashCommandBuilder()
  .setName("questiontest")
  .setDescription("gives a test response");

export async function execute(interaction: any) {
  const api =
    "https://opentdb.com/api.php?amount=1&category=15&difficulty=easy";

  // Fetch the API
  const response = await fetch(api);
  const data = await response.json();

  // Extract and structure the question and answers
  const questionData = data.results[0];
  const questionText = he.decode(questionData.question);
  const correctAnswer = he.decode(questionData.correct_answer);
  const answers = questionData.incorrect_answers
    .concat(questionData.correct_answer)
    .sort(() => Math.random() - 0.5)
    .map((answer: any) => he.decode(answer));

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
}
