# React Celebs Anagram Finder
A version of the previous Celeb anagram finder, but this time built using React and with a few added features.

Live at -
https://hakeem-star.github.io/React-celeb-anagram-finder/index.html

This tool allows you to find the Celebrity in an anagram even if it includes some replaced letters(if they are in the database) e.g.TRUMFDAONDL

It will return a result if there is at least an 80% match. 

This celebrity anagram finder accepts single anagrams or a comma seperated list of anagrams. So you can input something like TRUMFDAONDL or Thanksmo,TRUMCDONALD,parsi/hl itno

It also remembers your previous searches and allows you to go back to them with a single click.

Special characters and spaces are also removed.

![React Celebs Anagram Finder](https://i.imgur.com/ZrWFOKa.png)


## Issues
It is currently using a fairly unreliable API which does not always return the same results. More reliable APIs seem to require a cost, but this was just an exercise to help me learn Javascript and React so it'll do for now.

Functionality for general anagrams has not been implemented. I need to find an API first.  

## Anagram Examples
"TRUMCDONALD", "SHAVERSINB", "SHAVERSINC", "SHAVERSINM", "SHAVERSINP", "HASTYMAREA", "HASTYMAREE", "HASTYMAREI","HASTYMAREL", "HASTYMAREN", "HASTYMAREO", "HASTYMARER", "HASTYMARES", "HASTYMARET", "HASTYMAREU", "SLIMSWINEAREAA","SLIMSWINEAREAE", "SLIMSWINEAREAI",SLIMSWINEAREAL","SLIMSWINEAREAN","SLIMSWINEAREAO","SLIMSWINEAREAR", "SLIMSWINEAREAS","SLIMSWINEAREAT", "SLIMSWINEAREAU", "ROTTENGROANA", "ROTTENGROANE", "ROTTENGROANI", "ROTTENGROANL", "ROTTENGROANN", "ROTTENGROANO","ROTTENGROANR", "ROTTENGROANS", "ROTTENGROANT", "ROTTENGROANU", "GRIMERTABOOB", "GRIMERTABOOC", "GRIMERTABOOM", "GRIMERTABOOP", "PUTINKARMAF","PUTINKARMAH", "PUTINKARMAV", "PUTINKARMAW", "PUTINKARMAY", "SLOTHMENWAILA", "SLOTHMENWAILE", "SLOTHMENWAILI", "SLOTHMENWAILL", "SLOTHMENWAILN","SLOTHMENWAILO", "SLOTHMENWAILR", "SLOTHMENWAILS", "SLOTHMENWAILT", "SLOTHMENWAILU", "BENLAIDLAWB", "BENLAIDLAWC", "BENLAIDLAWM", "BENLAIDLAWP","ONEMUTTISLANDA", "ONEMUTTISLANDE", "ONEMUTTISLANDI", "ONEMUTTISLANDL", "ONEMUTTISLANDN", "ONEMUTTISLANDO", "ONEMUTTISLANDR", "ONEMUTTISLANDS","ONEMUTTISLANDT", "ONEMUTTISLANDU", "JEDIMATHSA", "JEDIMATHSE", "JEDIMATHSI", "JEDIMATHSL", "JEDIMATHSN", "JEDIMATHSO", "JEDIMATHSR", "JEDIMATHSS","JEDIMATHST", "JEDIMATHSU"
