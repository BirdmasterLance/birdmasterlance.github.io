import express from "express";
import schedule from "node-schedule";
import cors from "cors";
import fs from "fs";
import readline from "readline";
import bodyParser from "body-parser";

let currentDate;
let currentGame;
let numWinnersNormal = 0;
let numWinnersHard = 0;

let todayCharacter;
let characterData;

let todayNormalCharacter;

let maxCharacters = 214;
let maxNormalCharacters = 155;

let serverVersion = '1.8.1';

let winnersFile = '/disk/haikyuudle/haikyuu-winners.json'
//winnersFile = 'resources' + winnersFile

let serverInfoFile = '/disk/haikyuudle/haikyuu-server-info.json'
//serverInfoFile = 'resources' + serverInfoFile

let pastGamesNormalFile  = '/disk/haikyuudle/past-games-normal.txt'
//pastGamesNormalFile = 'resources' + pastGamesNormalFile

let pastGamesHardFile = '/disk/haikyuudle/past-games-hard.txt'
//pastGamesHardFile = 'resources' + pastGamesHardFile

let randomCharactersFile = '/disk/haikyuudle/randomized.txt'
//randomCharactersFile = 'resources' + randomCharactersFile

let randomCharactersNormalFile = '/disk/haikyuudle/randomizedNormal.txt'
//randomCharactersNormalFile = 'resources' + randomCharactersNormalFile

const app = express();
const port = 3000;

app.use(express.json())

var jsonParser = bodyParser.json()

function setCorsHeaders(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
}
app.use(setCorsHeaders);

app.get('/test', cors(), (req, res) => {
    res.json({
        currentDate: currentDate, 
        currentGame: currentGame, 
        numWinnersNormal: numWinnersNormal,
        numWinnersHard: numWinnersHard, 
        character: todayCharacter, 
        normalModeCharacter: todayNormalCharacter,
        version: serverVersion});
});

// app.get('/infopast', cors(), (req, res) => {
//     res.json({
//         character: todayCharacter, 
//         normalModeCharacter: todayNormalCharacter});
// });

app.post('/sendHaikyuuWin', jsonParser, async (request, response) => {
    console.log(request.body)
    const serverJson = JSON.parse(fs.readFileSync(winnersFile, 'utf8'));
    
    let date = new Date();
    let currentDate = date.getFullYear() + '-' + date.toLocaleString('default', { month: 'numeric' }) + '-' + date.getDate();

    const { body } = request;

    if(serverJson[currentDate + '-' + body['mode']] === null || serverJson[currentDate + '-' + body['mode']] === undefined) {
        const initValues = {
            "1": 0,
            "2": 0,
            "3": 0,
            "4": 0,
            "5": 0,
            "6": 0,
            "7": 0,
            "8": 0,
            "9+": 0
        };
        serverJson[currentDate + '-' + body['mode']] = initValues;
    }

    if(body['mode'] == 'normal') {
        numWinnersNormal += 1
        serverJson[currentDate + '-' + body['mode']]['numWinners'] = numWinnersNormal
    }
    if(body['mode'] == 'hard') {
        numWinnersHard += 1
        serverJson[currentDate + '-' + body['mode']]['numWinners'] = numWinnersHard
    }

    if(body['numGuesses'] < 9) {
        serverJson[currentDate + '-' + body['mode']][body['numGuesses'].toString()] += 1;
    } else {
        serverJson[currentDate + '-' + body['mode']]['9+'] += 1;
    }

    fs.writeFileSync(winnersFile, JSON.stringify(serverJson), (error) => {
        if (error) throw error;
    });

    return response.send(200)

});

// Starts the server
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);

    let pstDate = new Date().toLocaleString('en-US', { timeZone: 'US/Pacific' });
    let date = new Date(pstDate);
    currentDate = date.getFullYear() + ' ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate();
    console.log(`Today is ${currentDate}`);

    const json = JSON.parse(fs.readFileSync('resources/json/haikyuu-characters.json', 'utf8'));
    characterData = json['characterData'];

    const serverJson = JSON.parse(fs.readFileSync(serverInfoFile, 'utf8'));
    currentGame = serverJson['currentDay'];
    console.log(`Today's game number is ${currentGame}`);
    

    // Create file if it doesn't exist
    if(!fs.existsSync(randomCharactersFile)) {
        var fd = fs.openSync(randomCharactersFile , 'w');
        fs.closeSync(fd);
        await shuffleCharacters('resources/txt/characters.txt', randomCharactersFile , 'hard');
    }

    if(!fs.existsSync(randomCharactersNormalFile)) {
        var fd = fs.openSync(randomCharactersNormalFile, 'w');
        fs.closeSync(fd);
        await shuffleCharacters('resources/txt/charactersNormal.txt', randomCharactersNormalFile, 'normal');
    }

    await getNewCharacter(randomCharactersFile, maxCharacters, 'hard');
    await getNewCharacter(randomCharactersNormalFile, maxNormalCharacters, 'normal');

});

// Reset the stats for the day
const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.minute = 0;
rule.tz = 'US/Pacific';

const resetDay = schedule.scheduleJob(rule, async () => {
    console.log("Starting new day");
    let date = new Date();
    currentDate = date.getFullYear() + ' ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate();
    numWinnersNormal = 0;
    numWinnersHard = 0;

    const serverJson = JSON.parse(fs.readFileSync(serverInfoFile, 'utf8'));

    currentGame = serverJson['currentDay'];
    currentGame = currentGame + 1;

    maxCharacters = serverJson['maxCharacters'];
    if(currentGame % serverJson['maxCharacters'] === 0) {
        console.log('Reset')
        await shuffleCharacters('resources/txt/characters.txt', randomCharactersFile, 'hard');
    } else if(currentGame % serverJson['maxNormalCharacters'] === 0) {
        await shuffleCharacters('resources/txt/charactersNormal.txt', randomCharactersNormalFile, 'normal');
    }
    else {
        await getNewCharacter(randomCharactersFile, maxCharacters, 'hard');
        await getNewCharacter(randomCharactersNormalFile, maxNormalCharacters, 'normal');
    }

    await writeToServerInfoFile();

    // Now that the day has reset, make a new day entry in the winner JSON
    const winnerJson = JSON.parse(fs.readFileSync(winnersFile, 'utf8'));
    const strDate = date.getFullYear() + '-' + date.toLocaleString('default', { month: 'numeric' }) + '-' + date.getDate();
    const initValues = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
        "5": 0,
        "6": 0,
        "7": 0,
        "8": 0,
        "9+": 0,
        "numWinners": 0
    };
    winnerJson[strDate + '-normal'] = initValues;
    winnerJson[strDate + '-hard'] = initValues;

    fs.writeFile(winnersFile, JSON.stringify(winnerJson), (error) => {
        if (error) throw error;
    });


});

async function getNewCharacter(inputFile, limit, mode) {
    const fileStream = fs.createReadStream(inputFile);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    let counter = 0;
    for await (const line of rl) {
        if(counter === (currentGame % limit)) {
            // Find the JSON from the list of character data
            // Since this JSON isn't going to be too large (maybe like 200 at best), it'll probably be ok to do it like this
            characterData.forEach(character => {
                if(character.name === line.trim()) {
                    if(mode === 'normal') {
                        todayNormalCharacter = character;
                        console.log(`${currentGame} Today's Normal Mode character: ${todayNormalCharacter.name}`);
                        fs.appendFileSync(pastGamesNormalFile, `"${currentGame}":"${character.name}"\n`);
                    }
                    else if(mode === 'hard') {
                        todayCharacter = character;
                        console.log(`${currentGame} Today's Hard Mode character: ${todayCharacter.name}`);
                        fs.appendFileSync(pastGamesHardFile, `${currentGame}":"${character.name}"\n`);
                    }
                }
            });
        }
        counter++;
    }
}

async function shuffleCharacters(input, output, mode) {

    const fileStream = fs.createReadStream(input);
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
    fs.writeFile(output, randomizedCharacters, (error) => {
        if (error) throw error;
    });

    await new Promise(r => setTimeout(r, 200));

    if(mode === 'normal') {
        getNewCharacter(randomCharactersNormalFile, maxNormalCharacters, 'normal');
    }
    else if(mode === 'hard') {
        getNewCharacter(randomCharactersFile, maxCharacters, 'hard');
    }
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

async function writeToServerInfoFile() {
    //const serverJson = JSON.parse(fs.readFileSync('/disk/haikyuudle/haikyuu-server-info.json', 'utf8'));

    let serverJson = { 
        currentDay: currentGame, 
        currentCharacter: todayCharacter.name,
        currentNormalCharacter: todayNormalCharacter.name,
        maxCharacters: maxCharacters,
        maxNormalCharacters: maxNormalCharacters
    }

    // Save today's information in the server JSON
    // serverJson['currentDay'] = currentGame + 1;
    // serverJson['currentCharacter'] = todayCharacter.name;
    // serverJson['currentNormalCharacter'] = todayNormalCharacter.name;
    // serverJson['maxCharacters'] = maxCharacters;
    // serverJson['maxNormalCharacters'] = maxNormalCharacters;

    console.log(`Saving ${JSON.stringify(serverJson)} to file`);

    fs.writeFileSync(serverInfoFile, JSON.stringify(serverJson));
}