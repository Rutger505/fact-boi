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

const typeRow =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("type")
      .setPlaceholder("Choose gamemode")
      .addOptions(
        { label: "Multiple Choice", value: "multiple" },
        { label: "True/False", value: "boolean" }
      )
  );

// Play button to start the trivia
const playButton =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("start_button")
      .setLabel("Start Trivia")
      .setStyle(ButtonStyle.Primary)
  );

const userNameInput = new TextInputBuilder()
  .setCustomId("question_count")
  .setLabel("Set question count")
  .setPlaceholder("Enter question count here")
  .setStyle(TextInputStyle.Short);

const userNameRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
  userNameInput
);

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play Trivia!!!");

export async function execute(
  interaction: CommandInteraction<CacheType>
): Promise<void> {
  const replyOptions: InteractionReplyOptions = {
    content: "Choose a trivia category and set your difficulty to get started!",
    components: [categoryRow, difficultyRow, typeRow, playButton],
  };

  console.log(difficultyRow.data);

  await interaction.reply(replyOptions);
}
