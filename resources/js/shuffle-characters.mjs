import fs from "fs";
import readline from "readline";

async function shuffleCharacters() {
    
    console.log("Shuffling character list...")
    
    const fileStream = fs.createReadStream('resources/txt/characters.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let characters = [];
    for await (const line of rl) {
        characters.push(line);
    }
    shuffle(characters);
    
    let randomizedCharacters = '';
    characters.forEach((character) => {
        randomizedCharacters += character + '\n';
    })
    randomizedCharacters = randomizedCharacters.substring(0, randomizedCharacters.length - 1);
    fs.writeFile('resources/txt/randomized.txt', randomizedCharacters, (error) => {
        if (error) throw error;
    });

    await new Promise(r => setTimeout(r, 200));

    console.log("Done shuffling.")
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

shuffleCharacters();