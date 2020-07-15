import celebAnagramFinder, {
  cleanInputValue,
  cleanCelebInputValue,
  occuranceCount,
  matchMaker,
} from "../utils/celebAnagramFinderAPICall";

const sourceData = ["Donald_Trump", "Robert_F._Wagner_Jr._(deputy_mayor)"];
let userInput, celebValues, userOccurance, celebOccurance;
const inputString = "Donaldé_%^$//Trum";

describe("Creates a match between input anagrams and value", () => {
  test("provides clean variations of the user input", () => {
    userInput = cleanInputValue(inputString);
    expect(userInput).toStrictEqual([["DONALDÉTRUM", inputString]])
  })


  test("provides clean variations of the celeb input", () => {
    celebValues = sourceData.map((value) => cleanCelebInputValue(value));
    expect(celebValues).toStrictEqual([
      ["DONALDTRUMP", "Donald Trump", "Donald_Trump"],
      ["ROBERTFWAGNERJR", "Robert F. Wagner Jr. (deputy mayor)", "Robert_F._Wagner_Jr._(deputy_mayor)"]])
  })

  test("Counts the occurance of a character", () => {
    userOccurance = occuranceCount(userInput);
    celebOccurance = occuranceCount(celebValues);

    expect(userOccurance).toStrictEqual({
      [inputString]: { D: 2, O: 1, N: 1, A: 1, L: 1, É: 1, T: 1, R: 1, U: 1, M: 1 },
    });

    expect(celebOccurance).toStrictEqual({
      "Donald Trump": { D: 2, O: 1, N: 1, A: 1, L: 1, T: 1, R: 1, U: 1, M: 1, P: 1 },
      "Robert F. Wagner Jr. (deputy mayor)": {
        A: 1, B: 1, E: 2, F: 1, G: 1, J: 1, N: 1, O: 1, R: 4, T: 1, W: 1,
      },
    });
  });

  test("matches 2 objects & returns percentage match", () => {

    expect(matchMaker(inputString, sourceData)).toStrictEqual({
      "DONALDÉTRUM": {
        "Donald Trump": [
          "91",
          "Donald_Trump",
        ],
        "Robert F. Wagner Jr. (deputy mayor)": ["33",
          "Robert_F._Wagner_Jr._(deputy_mayor)",
        ],
      }
    });
  });
});
