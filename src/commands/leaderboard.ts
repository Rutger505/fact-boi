import { ButtonStyle, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { db, userAnswers, users } from "../db";
import { desc, sql } from "drizzle-orm";

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Shows all users scores");

export async function execute(interaction: any) {
  const correctAnswersSQL = sql<number>`sum(case when ${userAnswers.isCorrect} then 1 else 0 end)`;

  // Get user scores using SQL aggregation
  const leaderboard = await db
    .select({
      userId: users.id,
      displayName: users.displayName,
      totalAnswers: sql<number>`count(${userAnswers.id})`.as("totalAnswers"),
      correctAnswers: correctAnswersSQL.as("correctAnswers"),
      accuracy:
        sql<number>`round(${correctAnswersSQL}::numeric / count(${userAnswers.id}) * 100, 1)`.as(
          "accuracy"
        ),
    })
    .from(users)
    .leftJoin(userAnswers, sql`${users.id} = ${userAnswers.userId}`)
    .groupBy(users.id, users.displayName)
    .orderBy(desc(correctAnswersSQL)) // Use the SQL expression directly, not the alias
    .limit(10);

  if (leaderboard.length === 0) {
    await interaction.reply("No scores recorded yet!");
    return;
  }

  // Create an embed for the leaderboard
  const embed = new EmbedBuilder()
    .setTitle("🏆 Trivia Leaderboard")
    .setColor("#FFD700")
    .setDescription("Top 10 players by correct answers")
    .addFields(
      leaderboard.map((entry, index) => ({
        name: `${getPosition(index + 1)} ${entry.displayName}`,
        value: `✅ ${entry.correctAnswers || 0} correct (${entry.accuracy || 0}%)\n📝 ${entry.totalAnswers || 0} total answers`,
        inline: false,
      }))
    )
    .setFooter({ text: "Keep playing to improve your rank!" })
    .setTimestamp();

  await interaction.reply({ embeds: [embed] });
}

function getPosition(position: number): string {
  switch (position) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return `${position}.`;
  }
}
