import celebAnagramFinder, {
  cleanInputValue,
  celebNameCleanup,
  occuranceCount,
  matchMaker,
} from "../celebAnagramFinderAPICall";

describe("Creates a match between input anagrams and value", () => {
  test("cleans User input & returns an array", () => {
    expect(cleanInputValue("HASTYMA%$REL,HasbdN,")).toStrictEqual([
      "HASTYMAREL",
      "HASBDN",
    ]);
  });

  test("Removes spaces & special Characters", () => {
    expect(celebNameCleanup("HAS %^TYMAREL")).toBe("HASTYMAREL");
  });

  test("Counts the occurance of a character", () => {
    expect(occuranceCount(["SHAVERSIN"])).toStrictEqual({
      SHAVERSIN: { S: 2, H: 1, A: 1, V: 1, E: 1, R: 1, I: 1, N: 1 },
    });
  });

  test("matches 2 objects & returns percentage match", () => {
    const userInput = occuranceCount(["DONALTRUMP"]);
    const celebName = occuranceCount(["DONALDTRUMP"]);
    expect(matchMaker(userInput, celebName)).toStrictEqual({
      DONALTRUMP: { DONALDTRUMP: "91" },
    });
  });
});
