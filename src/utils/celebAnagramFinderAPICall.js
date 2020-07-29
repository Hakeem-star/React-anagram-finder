import fetchFromApi from "./fetchCelebData";

export function cleanInputValue(value) {
  //write input value to anagram variable
  //Check if there are multiple ANAGRAMS and split into array
  let cleanValue = [];
  //Clean value
  if (value.includes(",")) {
    //Create array from comma seperated anagram and remove spaces
    cleanValue = value
      .split(",")
      //Remove any non alphabet values
      .map((val, index, orig) => {
        return [val.replace(/[^\p{L}\p{Nd}]/gu, "").toUpperCase(), orig[index]];
      })
      .filter((el) => el[0] !== "");
  } else {
    //If there is only one ANAGRAM value
    //Place Anagram into Array
    //Remove any non alphabet values
    // console.log(value);
    cleanValue = [[value.replace(/[^\p{L}\p{Nd}]/gu, "").toUpperCase(), value]];
  }
  return cleanValue;
}

export function cleanCelebInputValue(value) {
  //write input value to anagram variable
  //Check if there are multiple ANAGRAMS and split into array
  let cleanValue = [];
  //Clean value
  //Place name into Array
  //Remove any non alphabet values
  const noBrackets = value.replace(/\(.*\)/u, "").trim();
  const noUnderScore = value.replace(/_/g, " ").trim();
  // const noBracketsNoUnderScore = noBrackets.replace(/_/g, " ");
  const cleanUpper = noBrackets.replace(/[^\p{L}\p{Nd}]/gu, "").toUpperCase();
  //["ROBERTFWAGNERJR","Robert F. Wagner Jr. (deputy mayor)","Robert_F._Wagner_Jr._(deputy_mayor)"]
  cleanValue = [cleanUpper, noUnderScore, value];
  return cleanValue;
}

export function occuranceCount(arrayToCountContainer) {
  //Count the occurances of letters within the current anagram
  let letterCount = {};
  //Go through the anagram array
  //[["TRUMP","trump"]]
  arrayToCountContainer.forEach((wordsArray, ind) => {
    //Split the anagram into an array of individual letters
    // console.log(anagramsArrayCounter);
    const splitCleanUppercaseWord = wordsArray[0].toString().split("");
    const orginalword = wordsArray[1];
    //[S,H,A,V,E,R,S,I,N]

    //Iterate through each letter
    splitCleanUppercaseWord.forEach(function (letter, index) {
      if (letterCount[orginalword] === undefined) {
        letterCount[orginalword] = {};
      }

      //Create an object that uses the letter as a key
      //Then with a filter, it iterates through the array containing all the ANAGRAM letters to compare the key letter
      //Then uses the length of the filtered result as the amount of occurances
      letterCount[orginalword][letter] = splitCleanUppercaseWord.filter(
        (filteredSingleAnagramArray) =>
          //iterate through letters/Create an array of matching letters/get the length of that array to provide a count of the occurance of the letter in the array
          filteredSingleAnagramArray === letter
      ).length;
      if (letterCount[orginalword] === undefined) {
        console.log(orginalword);
      }
    });
    //anagramLetterCount = {"TRUMCDONALD":{"t":1,"r":1}}
  });

  return letterCount;
}

export function matchMaker(userInputArray, celebArray) {
  //Normalize values
  //Input

  //clean - remove special characters
  const userInputAnagram = cleanInputValue(userInputArray);
  //[["TRUMP", "trump"]]
  //count
  const userInputAnagramOccuranceCount = occuranceCount(userInputAnagram);
  //{trump: {T: 1, R: 1, U: 1, M: 1, P: 1}}

  const userInputAnagramOccuranceCountKeys = Object.keys(
    userInputAnagramOccuranceCount
  );
  //["trump"]

  //Celebs
  //clean - remove special characters
  let celebNames = [],
    countedCelebNamesKeys = [];

  celebArray.forEach((celebName) => {
    let clean = cleanCelebInputValue(celebName);
    celebNames.push(clean);
    countedCelebNamesKeys.push(clean[1]);
  });

  //[["ROBERTFWAGNERJR","Robert F. Wagner Jr. (deputy mayor)","Robert_F._Wagner_Jr._(deputy_mayor)"]]

  //count
  const countedCelebNames = occuranceCount(celebNames);
  //{50 Cent: {0: 1, 5: 1, C: 1, E: 1, N: 1, T: 1},
  //Aaron Carter: {A: 3, R: 3, O: 1, N: 1, C: 1}}
  // countedCelebNamesKeys = Object.keys(countedCelebNames);
  // //  Object.keys(countedCelebNames);
  // //["Donald Trump"]
  // celebNames.forEach((value) => {
  //   let test = countedCelebNamesKeys.find((val) => val === value[1]);
  //   if (test === undefined) {
  //     console.log(value);
  //   }
  // });
  // debugger;
  let recordKeeper = {};
  // {"TRUMCDONALD":{"t":1,"r":1}}
  //For all the anagrams the user entered

  for (
    let userInputIterator = 0;
    userInputIterator < userInputAnagramOccuranceCountKeys.length;
    userInputIterator++
  ) {
    const currentUserInputAnagramName =
      userInputAnagramOccuranceCountKeys[userInputIterator];
    const cleanUserAnagrams = userInputAnagram[userInputIterator][0];

    recordKeeper[cleanUserAnagrams] = {};

    //For each of the celeb names
    for (
      let celebNameIterator = 0;
      celebNameIterator < countedCelebNamesKeys.length;
      celebNameIterator++
    ) {
      const cleanCelebName = celebNames[celebNameIterator][0];

      //Check if total of the user input is larger than the celeb name
      // TRUMCDONALD.length
      if (cleanUserAnagrams.length <= cleanCelebName.length) {
        //DONALDTRUMP
        //Look through the results object for the user input anagram to compare
        //T
        const userInputLettersArray = Object.keys(
          userInputAnagramOccuranceCount[currentUserInputAnagramName]
        );

        userInputLettersArray.forEach((userInputLetter, index, orig) => {
          //D
          const currentUserInputLetter =
            userInputAnagramOccuranceCountKeys[userInputIterator];

          const userInputCurrentLetterOccurance =
            userInputAnagramOccuranceCount[currentUserInputLetter];
          //countedUserInputAnagram[userAnagrams];
          //donaldtrumf

          const celebName = countedCelebNamesKeys[celebNameIterator];
          const cleanCelebname = celebNames[celebNameIterator][0];
          //"Donald Trump"

          //DONALDTRUMP
          const celebArrayCurrentCelebOccurance = countedCelebNames[celebName];

          // countedCelebNames[celebName];
          //If the celebs anagram contains the letter from the user input
          if (celebArrayCurrentCelebOccurance.hasOwnProperty(userInputLetter)) {
            //If user input anagram letter count is smaller than the celeb anagram
            if (
              userInputCurrentLetterOccurance[userInputLetter] <=
              celebArrayCurrentCelebOccurance[userInputLetter]
            ) {
              //If there is no previous record of this anagram & celebName
              recordKeeper[cleanUserAnagrams][celebName] === undefined
                ? (recordKeeper[cleanUserAnagrams][celebName] =
                    userInputCurrentLetterOccurance[userInputLetter])
                : (recordKeeper[cleanUserAnagrams][celebName] +=
                    userInputCurrentLetterOccurance[userInputLetter]);
            }
          }
          //if we are at the last one, I want to calculate the percentage
          if (
            index === orig.length - 1 &&
            recordKeeper[cleanUserAnagrams][celebName] !== undefined
          ) {
            recordKeeper[cleanUserAnagrams][celebName] = [
              (
                (recordKeeper[cleanUserAnagrams][celebName] /
                  cleanCelebname.length) *
                100
              ).toFixed(0),
              celebNames[celebNameIterator][2],
            ];
          }
        });
      }
    }
  }
  return recordKeeper;
  //{"TRUMCDONALD":{"DONALDTRUMP":90}}
}

// TRUMP:
//   AAMIRKHAN: "22"
//   AARONCARTER: "18"
//   AARONPAUL: "33"
//   ADAMSANDLER: "18"

function formatForTable(builtResult, anagramType) {
  let arr = [];
  //Iterate through each anagram
  for (const key in builtResult) {
    //Iterate through the compared values for each
    for (const resultMatch in builtResult[key]) {
      arr.push({
        key: arr.length + 1,
        Anagram: key,
        //Create a different key depending on the anagram type
        //This affects the results shown on the table
        [anagramType === "celebs" ? "Name" : "Word"]: resultMatch,
        "%": builtResult[key][resultMatch][0],
        url: builtResult[key][resultMatch][1],
      });
    }
  }
  return arr;
}

export default async function celebAnagramFinder(userInput, anagramType) {
  //local results to prevent too many API calls
  // let celebsFromApi = celebAPIResult_local;

  // STRUCTURE---- celebsFromApi = {CelebrityValues: [{ name: "Serena Williams" },{ name: "Kacey Musgraves" }, { name: "Ivana Milicevic" } ] };
  // console.log("Celebs from API", celebsFromApi.CelebrityValues)

  //Example Anagrams to search for
  /* var anagram = ["TRUMCDONALD", "SHAVERSINB", "SHAVERSINC", "SHAVERSINM", "SHAVERSINP", "HASTYMAREA", "HASTYMAREE", "HASTYMAREI",
           "HASTYMAREL", "HASTYMAREN", "HASTYMAREO", "HASTYMARER", "HASTYMARES", "HASTYMARET", "HASTYMAREU", "SLIMSWINEAREAA",
           "SLIMSWINEAREAE", "SLIMSWINEAREAI", "SLIMSWINEAREAL", "SLIMSWINEAREAN", "SLIMSWINEAREAO", "SLIMSWINEAREAR", "SLIMSWINEAREAS",
           "SLIMSWINEAREAT", "SLIMSWINEAREAU", "ROTTENGROANA", "ROTTENGROANE", "ROTTENGROANI", "ROTTENGROANL", "ROTTENGROANN", "ROTTENGROANO",
           "ROTTENGROANR", "ROTTENGROANS", "ROTTENGROANT", "ROTTENGROANU", "GRIMERTABOOB", "GRIMERTABOOC", "GRIMERTABOOM", "GRIMERTABOOP", "PUTINKARMAF",
           "PUTINKARMAH", "PUTINKARMAV", "PUTINKARMAW", "PUTINKARMAY", "SLOTHMENWAILA", "SLOTHMENWAILE", "SLOTHMENWAILI", "SLOTHMENWAILL", "SLOTHMENWAILN",
           "SLOTHMENWAILO", "SLOTHMENWAILR", "SLOTHMENWAILS", "SLOTHMENWAILT", "SLOTHMENWAILU", "BENLAIDLAWB", "BENLAIDLAWC", "BENLAIDLAWM", "BENLAIDLAWP",
           "ONEMUTTISLANDA", "ONEMUTTISLANDE", "ONEMUTTISLANDI", "ONEMUTTISLANDL", "ONEMUTTISLANDN", "ONEMUTTISLANDO", "ONEMUTTISLANDR", "ONEMUTTISLANDS",
           "ONEMUTTISLANDT", "ONEMUTTISLANDU", "JEDIMATHSA", "JEDIMATHSE", "JEDIMATHSI", "JEDIMATHSL", "JEDIMATHSN", "JEDIMATHSO", "JEDIMATHSR", "JEDIMATHSS",
           "JEDIMATHST", "JEDIMATHSU"];
  */
  //  const celebNames = await _fetchFromCelebApi();

  // console.log(
  //   formatForTable(matchMaker(countedUserInputAnagrams, countedCelebNames))
  // );
  // console.log(formatForTable(matchMaker(userInput, celebNames)));
  const apiData = await fetchFromApi(anagramType);

  //preferably the dataset would be de-duped, but just in case
  const dedupedCelebNames = [...new Set(apiData)];
  return formatForTable(matchMaker(userInput, dedupedCelebNames), anagramType);
}
