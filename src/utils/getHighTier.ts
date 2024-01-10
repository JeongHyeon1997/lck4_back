export const getHighTier = (inputString: string) => {
  const tokens = inputString
    .split(/\s+/)
    .filter((token) => token.trim() !== "");
  const tierOrder = [
    "IRON",
    "BRONZE",
    "SILVER",
    "GOLD",
    "PLATINUM",
    "DIAMOND",
    "MASTER",
    "GRANDMASTER",
    "CHALLENGER",
  ];

  for (let i = 0; i < tokens.length; i += 2) {
    const tierInToken = tokens[i + 1];
    if (tierOrder.includes(tierInToken)) {
      const tier = (tokens[i] + " " + tierInToken).split(":");
      return tier[1]?.trim() || "";
    }
  }

  return "UNRANKED";
};
