import celebAnagramFinder, {
  cleanInputValue,
  celebNameCleanup,
  occuranceCount,
  matchMaker,
} from "../utils/celebAnagramFinderAPICall";

describe("Creates a match between input anagrams and value", () => {
  test("cleans User input & returns an array", () => {
    expect(cleanInputValue("HASTYMA%$REL,HasbdN,")).toStrictEqual([
      ["HASTYMAREL", "HASTYMA%$REL"],
      ["HASBDN", "HasbdN"],
    ]);
  });

  test("Removes spaces & special Characters", () => {
    expect(cleanInputValue("HAS %^TYMAREL")).toStrictEqual([
      ["HASTYMAREL", "HAS %^TYMAREL"],
    ]);
  });

  test("Counts the occurance of a character", () => {
    const input = cleanInputValue("SHAverSIN");
    expect(occuranceCount(input)).toStrictEqual({
      SHAverSIN: { S: 2, H: 1, A: 1, V: 1, E: 1, R: 1, I: 1, N: 1 },
    });
  });

  test("matches 2 objects & returns percentage match", () => {
    const userInput = "donaltrump";
    const celebName = ["Donald Trump"];
    expect(matchMaker(userInput, celebName)).toStrictEqual({
      DONALTRUMP: { "Donald Trump": "91" },
    });
  });
});
