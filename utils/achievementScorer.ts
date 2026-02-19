
/**
 * Scores an achievement string based on impact keywords and quantitative data.
 * Used to determine "Top 2" highlights for collapsed views.
 */
export const scoreAchievement = (text: string): number => {
  let score = 0;
  
  // 1. Numbers / Quantitative Data (Highest Value)
  // Matches: 30%, $500k, 10x, 2024, +40%
  if (/(\d+(?:[.,]\d+)?%?)|(\$\d+)|(\d+x)/.test(text)) score += 5;
  
  // 2. Strong Action Verbs / Result Indicators
  if (/\b(improved|increased|reduced|launched|delivered|generated|saved|achieved|won|led|created|developed)\b/i.test(text)) score += 3;
  
  // 3. Scale / Scope Indicators
  if (/\b(cross-functional|roadmap|stakeholders|global|strategy|managed|team|fortune 500|enterprise)\b/i.test(text)) score += 2;
  
  // 4. Length Penalty (Too long is bad for mobile scan)
  if (text.length > 140) score -= 1;
  
  return score;
};

/**
 * Picks the top N achievements from a list based on their impact score.
 */
export const pickTopAchievements = (achievements: string[], n: number = 2): string[] => {
  if (!achievements || achievements.length <= n) return achievements;
  
  const scored = achievements.map((text, idx) => ({
    idx,
    text,
    score: scoreAchievement(text)
  }));
  
  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);
  
  // Return top N texts, maintaining their relative original order is usually better for narrative flow,
  // but here we want the *best* ones. If narrative matters, we might want to resort by 'idx'.
  // Let's re-sort by index to keep original timeline/flow if they are sequential.
  const topN = scored.slice(0, n).sort((a, b) => a.idx - b.idx);
  
  return topN.map(i => i.text);
};

/**
 * Extracts short KPI phrases (e.g., "+35% conversion") from a longer text.
 */
export const extractKPIs = (text: string): string[] => {
  // Regex to find percentages, currency, or multipliers followed by a word
  // e.g., "35%", "$500M", "10x"
  const regex = /([+~]?(?:\$)?\d+(?:[.,]\d+)?[%kMKx]?)\s+([a-zA-Z]{3,})/g;
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    // match[0] is full match "35% conversion"
    // match[1] is number "35%"
    // match[2] is word "conversion"
    
    // Filter out common non-KPI words
    const word = match[2].toLowerCase();
    if (['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'year', 'month'].includes(word)) {
        continue;
    }
    
    matches.push(`${match[1]} ${match[2]}`);
  }

  // If no "Number + Word" pattern found, try finding just standout numbers like "$600M"
  if (matches.length === 0) {
      const standaloneRegex = /([+~]?(?:\$)\d+(?:[.,]\d+)?[kMK]?)|(\d+(?:[.,]\d+)?%)/g;
       while ((match = standaloneRegex.exec(text)) !== null) {
           matches.push(match[0]);
       }
  }

  return matches.slice(0, 2); // Return top 2 found per string
};
