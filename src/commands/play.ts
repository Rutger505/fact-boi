import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ButtonInteraction,
} from "discord.js";
import type {
  MessageActionRowComponentBuilder,
  InteractionReplyOptions,
  CacheType,
} from "discord.js"; // Importing type-only

// Create the first ActionRow with the trivia category select menu
const categoryRow =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("trivia_category")
      .setPlaceholder("Choose a trivia category")
      .addOptions(
        {
          label: "Science",
          description: "Test your knowledge in Science!",
          value: "science",
        },
        {
          label: "History",
          description: "How well do you know history?",
          value: "history",
        },
        {
          label: "Geography",
          description: "Show off your geography skills!",
          value: "geography",
        },
        {
          label: "Entertainment",
          description: "Questions about movies, music, and more!",
          value: "entertainment",
        }
      )
  );

// Create the second ActionRow with the difficulty select menu
const difficultyRow =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("difficulty")
      .setPlaceholder("Set your difficulty")
      .addOptions(
        { label: "Easy", value: "easy" },
        { label: "Medium", value: "medium" },
        { label: "Hard", value: "hard" }
      )
  );

// Button to trigger the modal for question count input
const numberInputButton =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("set_question_count")
      .setLabel("Set Question Count")
      .setStyle(ButtonStyle.Secondary)
  );

// Play button to start the trivia
const playButton =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("start_button")
      .setLabel("Start Trivia")
      .setStyle(ButtonStyle.Primary)
  );

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play Trivia!!!");

export async function execute(
  interaction: CommandInteraction<CacheType>
): Promise<void> {
  const replyOptions: InteractionReplyOptions = {
    content: "Choose a trivia category and set your difficulty to get started!",
    components: [categoryRow, difficultyRow, playButton],
  };

  await interaction.reply(replyOptions);
}

// Handling the button interaction to open the modal for question count
export async function handleButtonInteraction(
  interaction: ButtonInteraction<CacheType>
): Promise<void> {
  if (interaction.customId === "set_question_count") {
    const modal = new ModalBuilder()
      .setCustomId("question_count_modal")
      .setTitle("Set Question Count");

    const questionCountInput = new TextInputBuilder()
      .setCustomId("question_count")
      .setLabel("Number of Questions")
      .setPlaceholder("Enter a number")
      .setStyle(TextInputStyle.Short);

    // Add the TextInputBuilder to an ActionRowBuilder for the modal
    const questionCountRow =
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        questionCountInput
      );

    // Add the row to the modal
    modal.addComponents(questionCountRow);

    // Show the modal to the user
    await interaction.showModal(modal);
  }
}
