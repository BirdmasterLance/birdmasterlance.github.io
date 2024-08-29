import express from "express";
import schedule from "node-schedule";
import cors from "cors";
import fs from "fs";
import readline from "readline";

let currentDate;
let currentGame = 10;
let numWinners = 0;
let todayCharacter;
let characterData;
let maxCharacters = 179;

const app = express();
const port = 3000;

app.get('/test', cors(), (req, res) => {
    res.json({currentDate: currentDate, currentGame: currentGame+1, numWinners: numWinners, character: todayCharacter, version: '1.2.0'});
});

app.post('/test', async (request, response) => {
    const data = await request.body;
    console.log(data);
});

// Starts the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    let date = new Date();
    currentDate = date.getFullYear() + ' ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate();
    console.log(`Today is ${currentDate}`);

    const json = JSON.parse(fs.readFileSync('resources/json/haikyuu-characters.json', 'utf8'));
    characterData = json['characterData'];

    getNewCharacter();
});

// Reset the stats for the day
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.tz = 'US/Pacific';

const resetDay = schedule.scheduleJob(rule, () => {
    let date = new Date();
    currentDate = date.getFullYear() + ' ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate();
    currentGame++;
    numWinners = 0;

    const serverJson = JSON.parse(fs.readFileSync('resources/json/haikyuu-server-info.json', 'utf8'));
    maxCharacters = serverJson['maxCharacters'];
    if(currentGame % serverJson['maxCharacters'] === 0) {
        console.log('Reset')
        shuffleCharacters();
    }
    else {
        getNewCharacter();
    }
});

async function getNewCharacter() {

    const fileStream = fs.createReadStream('resources/txt/randomized.txt');
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    let counter = 0;
    for await (const line of rl) {
        // console.log('     ' + counter + ' ' + currentGame + ' % ' + maxCharacters + ' = ' + (currentGame % maxCharacters))
        if(counter === (currentGame % maxCharacters)) {
            // Find the JSON from the list of character data
            // Since this JSON isn't going to be too large (maybe like 200 at best), it'll probably be ok to do it like this
            characterData.forEach(character => {
                // console.log('     ' + currentGame + ' ' + character.name + ' ' + line.trim())
                if(character.name === line.trim()) {
                    todayCharacter = character;
                    // console.log('     ' + currentGame + ' ' + character.name + ' ' + line.trim())
                }
            });
        }
        counter++;
    }

    const serverJson = JSON.parse(fs.readFileSync('resources/json/haikyuu-server-info.json', 'utf8'));
    serverJson['currentDay'] = currentGame;
    serverJson['currentCharacter'] = todayCharacter.name;
    serverJson['maxCharacters'] = counter;

    fs.writeFile('resources/json/haikyuu-server-info.json', JSON.stringify(serverJson), (error) => {
        if (error) throw error;
    });

    console.log(`${currentGame} Today's character: ${todayCharacter.name}`);
}

async function shuffleCharacters() {
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

    getNewCharacter();
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