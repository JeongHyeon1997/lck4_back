"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHighTier = void 0;
const getHighTier = (inputString) => {
    var _a;
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
            return ((_a = tier[1]) === null || _a === void 0 ? void 0 : _a.trim()) || "";
        }
    }
    return "UNRANKED";
};
exports.getHighTier = getHighTier;
//# sourceMappingURL=getHighTier.js.map