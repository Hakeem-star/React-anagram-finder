export function cleanInputValue(value) {
  //write input value to anagram variable
  //Check if there are multiple ANAGRAMS and split into array

  //Clean value
  const uppercase_spaceless_value = value
    .toUpperCase()
    //remove spaces
    .replace(/\s/g, "");

  if (value.includes(",")) {
    //Create array from comma seperated anagram and remove spaces
    return (
      uppercase_spaceless_value
        .split(",")
        //Remove any non alphabet values
        .map((val, index) => val.replace(/[^A-Z]/g, ""))
        .filter((el) => el !== "")
    );
  } else {
    //If there is only one ANAGRAM value
    //Place Anagram into Array
    //Remove any non alphabet values
    return [uppercase_spaceless_value.replace(/[^A-Z]/g, "")].filter(
      (el) => el !== ""
    );
  }
}

export function celebNameCleanup(value) {
  return (
    value
      .toUpperCase()
      //remove spaces
      .replace(/\s/g, "")
      .replace(/[^A-Z]/g, "")
  );
}

export function occuranceCount(anagramToCount) {
  //Count the occurances of letters within the current anagram
  let anagramLetterCount = {};
  // debugger;
  //Go through the anagram array
  anagramToCount.forEach((anagramsArrayCounter) => {
    //Split the anagram into an array of individual letters
    let singleAnagramArray = anagramsArrayCounter.split("");
    //console.log(splitAnagramToLetters)
    //[S,H,A,V,E,R,S,I,N]

    //make an array of each letter and iterate through
    singleAnagramArray.forEach(function (anagramLetter, index, initialArray) {
      if (anagramLetterCount[anagramsArrayCounter] === undefined) {
        anagramLetterCount[anagramsArrayCounter] = {};
      }
      //Create an object that uses the letter as a key
      //Then with a filter, it iterates through the array containing all the ANAGRAM letters to compare the key letter
      //Then uses the length of the filtered result as the amount of occurances
      anagramLetterCount[anagramsArrayCounter][
        anagramLetter
      ] = initialArray.filter(
        (filteredSingleAnagramArray) =>
          //iterate through letters/Create an array of matching letters/get the length of that array to provide a count of the occurance of the letter in the array
          filteredSingleAnagramArray === anagramLetter
      ).length;
    });
    //anagramLetterCount = {"TRUMCDONALD":{"t":1,"r":1}}
  });
  return anagramLetterCount;
}

export function matchMaker(userInputArray, celebArray) {
  let recordKeeper = {};
  // {"TRUMCDONALD":{"t":1,"r":1}}
  //For all the anagrams the user entered

  for (const userInputAnagrams in userInputArray) {
    recordKeeper[userInputAnagrams] = {};
    // userInputArray[anagram]

    // TRUMCDONALD.length
    let userInputAnagramsLength = userInputAnagrams.length;
    //For each of the celeb names
    for (const celebName in celebArray) {
      //Check if total of the user input is larger than the celeb name
      if (userInputAnagramsLength <= celebName.length) {
        //DONALDTRUMP
        //Look through the results object for the user input anagram to compare
        //T
        let userInputLettersArray = Object.keys(
          userInputArray[userInputAnagrams]
        );
        userInputLettersArray.forEach((userInputLetter, index, orig) => {
          const userinputAnagramResultsCountObject =
            userInputArray[userInputAnagrams];
          const celebArrayAnagramResultsCountObject = celebArray[celebName];
          //If the celebs anagram contains the letter in the user input
          if (
            celebArrayAnagramResultsCountObject.hasOwnProperty(userInputLetter)
          ) {
            //If user unput anagram letter count is smaller than the celeb anagram
            if (
              userinputAnagramResultsCountObject[userInputLetter] <=
              celebArrayAnagramResultsCountObject[userInputLetter]
            ) {
              //If there is no previous record of this anagram & celebName
              recordKeeper[userInputAnagrams][celebName] === undefined
                ? (recordKeeper[userInputAnagrams][celebName] =
                    userinputAnagramResultsCountObject[userInputLetter])
                : (recordKeeper[userInputAnagrams][celebName] +=
                    userinputAnagramResultsCountObject[userInputLetter]);
            }
          }
          //if we are at the last one, I want to calculate the percentage
          if (
            index === orig.length - 1 &&
            recordKeeper[userInputAnagrams][celebName] !== undefined
          ) {
            recordKeeper[userInputAnagrams][celebName] = (
              (recordKeeper[userInputAnagrams][celebName] / celebName.length) *
              100
            ).toFixed(0);
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

function formatForTable(builtResult) {
  let arr = [];
  //Iterate through each anagram
  for (const key in builtResult) {
    //Iterate through the compared values for each
    for (const resultMatch in builtResult[key]) {
      arr.push({
        key: arr.length + 1,
        Anagram: key,
        Name: resultMatch,
        "%": builtResult[key][resultMatch],
      });
    }
  }
  return arr;
}
export default async function celebAnagramFinder(userInput, threshold) {
  let anagram = cleanInputValue(userInput);

  //Bypass CORS if needed. Replace fetch url with proxyUrl + targetUrl
  let proxyUrl = "https://cors-anywhere.herokuapp.com/";
  let targetUrl = "https://celebritybucks.com/developers/export/JSON";

  //Fetch the json of celebs
  let resFetch = await fetch(proxyUrl + targetUrl);

  //convert result to JSON
  let celebsFromApi = await resFetch.json();

  //If it fails, log message and quit
  if (resFetch.status !== 200) {
    console.log(
      "Looks like there was a problem. Status Code: " + resFetch.status
    );
    return;
  }

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

  const countedUserInputAnagrams = occuranceCount(anagram);

  const celebNames = celebsFromApi.CelebrityValues.map((celeb) => {
    return celebNameCleanup(celeb.name);
  });

  const countedCelebNames = occuranceCount(celebNames);
  console.log(
    formatForTable(matchMaker(countedUserInputAnagrams, countedCelebNames))
  );
  return formatForTable(
    matchMaker(countedUserInputAnagrams, countedCelebNames)
  );
}
