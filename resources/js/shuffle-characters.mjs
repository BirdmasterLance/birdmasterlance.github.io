import fs from "fs";
import readline from "readline";

async function shuffleCharacters(input, output, skipCharacters) {
    
    console.log("Shuffling character list...");
    console.log("Skipping " + skipCharacters);

    const fileStream = fs.createReadStream(input);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    let characters = [];
    for await (const line of rl) {
        if(!skipCharacters.includes(line)) {
            characters.push(line);
        }
    }
    shuffle(characters);
    
    let randomizedCharacters = '';
    skipCharacters.forEach((charName) => {
        randomizedCharacters += charName + '\n';
    })
    characters.forEach((character) => {
        randomizedCharacters += character + '\n';
    })
    randomizedCharacters = randomizedCharacters.substring(0, randomizedCharacters.length - 1);
    fs.writeFile(output, randomizedCharacters, (error) => {
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

const inputHard = 'resources/txt/characters.txt';
const outputHard = 'resources/txt/randomized.txt';

const inputNormal = 'resources/txt/charactersNormal.txt';
const outputNormal = 'resources/txt/randomizedNormal.txt'

// shuffleCharacters(inputNormal, outputNormal, 
//     ['Numai Kazuma',
//     'Izaka Nobuyoshi',
//     'Bobata Kazuma',
//     'Shibuya Rikuto',
//     'Kai Ryosei',
//     'Kawatabi Shunki',
//     'Tsuchiyu Arata',
//     'Sakishima Isumi',
//     'Hondo Subaru',
//     'Sasaya Takehito',
//     'Komi Haruki',
//     'Atema Yoshitomo',
//     'Tsukishima Kei']);

shuffleCharacters(inputNormal, outputNormal, ['','','','','','','','','','','','','','','','','','','']);