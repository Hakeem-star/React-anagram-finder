# React Anagram Finder
An anagram finder with plenty of features built using React, Less, Ant Design & Firebase.

Become a Countdown/Scrabble champion!

Live at -
https://anagram-finder-7228c.web.app/

![Anagram Finder video](https://media.giphy.com/media/cnRRVKLAceg5G7q2a7/giphy.gif)

This tool allows you to find the Celebrity or word in an anagram even if it includes some incorrect letters(if they are in the database) e.g.TRUMFDAONDL

This anagram finder accepts single anagrams or a comma seperated list of anagrams. It also cleans your anagram input, so you can search for something like TRUMFDAONDL or Thanksmo,TRUMCDONALD,parsi/hl itno

It also remembers your previous searches and allows you to go back to them with a single click.

You can also log in to keep your searches across devices.

## To run locally -
1. npm install
2. Change value of localTestEnv to **true** on line 5 in the fetchDataFiles.js document in the utils folder
3. npm start
4. Go to http://localhost:3000/

## Anagram Examples
"TRUMCDONALD", "SHAVERSINB", "SHAVERSINC", "SHAVERSINM", "SHAVERSINP", "HASTYMAREA", "HASTYMAREE", "HASTYMAREI","HASTYMAREL", "HASTYMAREN", "HASTYMAREO", "HASTYMARER", "HASTYMARES", "HASTYMARET", "HASTYMAREU", "SLIMSWINEAREAA","SLIMSWINEAREAE", "SLIMSWINEAREAI",SLIMSWINEAREAL","SLIMSWINEAREAN","SLIMSWINEAREAO","SLIMSWINEAREAR", "SLIMSWINEAREAS","SLIMSWINEAREAT", "SLIMSWINEAREAU", "ROTTENGROANA", "ROTTENGROANE", "ROTTENGROANI", "ROTTENGROANL", "ROTTENGROANN", "ROTTENGROANO","ROTTENGROANR", "ROTTENGROANS", "ROTTENGROANT", "ROTTENGROANU", "GRIMERTABOOB", "GRIMERTABOOC", "GRIMERTABOOM", "GRIMERTABOOP", "PUTINKARMAF","PUTINKARMAH", "PUTINKARMAV", "PUTINKARMAW", "PUTINKARMAY", "SLOTHMENWAILA", "SLOTHMENWAILE", "SLOTHMENWAILI", "SLOTHMENWAILL", "SLOTHMENWAILN","SLOTHMENWAILO", "SLOTHMENWAILR", "SLOTHMENWAILS", "SLOTHMENWAILT", "SLOTHMENWAILU", "BENLAIDLAWB", "BENLAIDLAWC", "BENLAIDLAWM", "BENLAIDLAWP","ONEMUTTISLANDA", "ONEMUTTISLANDE", "ONEMUTTISLANDI", "ONEMUTTISLANDL", "ONEMUTTISLANDN", "ONEMUTTISLANDO", "ONEMUTTISLANDR", "ONEMUTTISLANDS","ONEMUTTISLANDT", "ONEMUTTISLANDU", "JEDIMATHSA", "JEDIMATHSE", "JEDIMATHSI", "JEDIMATHSL", "JEDIMATHSN", "JEDIMATHSO", "JEDIMATHSR", "JEDIMATHSS","JEDIMATHST", "JEDIMATHSU"



