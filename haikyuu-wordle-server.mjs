import express from "express";
import schedule from "node-schedule";
import cors from "cors";
import fs from "fs";
import readline from "readline";
import bodyParser from "body-parser";

let currentDate;
let currentGame;
let numWinners = 0;

let todayCharacter;
let characterData;

let todayNormalCharacter;

let maxCharacters = 198;
let maxNormalCharacters = 139;

let serverVersion = '1.7.0';

const app = express();
const port = 3000;

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
        currentGame: currentGame+1, 
        numWinners: numWinners, 
        character: todayCharacter, 
        normalModeCharacter: todayNormalCharacter,
        version: serverVersion});
});

// app.get('/infopast', cors(), (req, res) => {
//     res.json({
//         character: todayCharacter, 
//         normalModeCharacter: todayNormalCharacter});
// });

// app.post('/receive', jsonParser, async (request, response) => {
//     const serverJson = JSON.parse(fs.readFileSync('resources/json/haikyuudle-winners.json', 'utf8'));

//     let date = new Date();
//     let currentDate = date.getFullYear() + '-' + date.toLocaleString('default', { month: 'numeric' }) + '-' + date.getDate();

//     if(serverJson[currentDate + '-' + data['mode']] === null || serverJson[currentDate + '-' + data['mode']] === undefined) {
//         const initValues = [
//             {"1": 0},
//             {"2": 0},
//             {"3": 0},
//             {"4": 0},
//             {"5": 0},
//             {"6": 0},
//             {"7": 0},
//             {"8": 0},
//             {"9+": 0}
//         ];
//         serverJson[currentDate + '-' + data['mode']] = initValues;
//     }

//     const data = await request.body;
//     switch(data['numGuesses']) {
//         case 1:
//             serverJson[currentDate + '-' + data['mode']][0]['1'] += 1;
//             break;
//         case 2:
//             serverJson[currentDate + '-' + data['mode']][1]['2'] += 1;
//             break;
//         case 3:
//             serverJson[currentDate + '-' + data['mode']][2]['3'] += 1;
//             break;
//         case 4:
//             serverJson[currentDate + '-' + data['mode']][3]['4'] += 1;
//             break;
//         case 5:
//             serverJson[currentDate + '-' + data['mode']][4]['5'] += 1;
//             break;
//         case 6:
//             serverJson[currentDate + '-' + data['mode']][5]['6'] += 1;
//             break;
//         case 7:
//             serverJson[currentDate + '-' + data['mode']][6]['7'] += 1;
//             break;
//         case 8:
//             serverJson[currentDate + '-' + data['mode']][7]['8'] += 1;
//             break;
//         default:
//             serverJson[currentDate + '-' + data['mode']][8]['9+'] += 1;
//             break;
//     }

//     fs.writeFile('resources/json/haikyuudle-winners.json', JSON.stringify(serverJson), (error) => {
//         if (error) throw error;
//     });

// });

// Starts the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);

    let pstDate = new Date().toLocaleString('en-US', { timeZone: 'US/Pacific' });
    let date = new Date(pstDate);
    currentDate = date.getFullYear() + ' ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate();
    console.log(`Today is ${currentDate}`);

    const json = JSON.parse(fs.readFileSync('/disk/haikyuudle/haikyuu-characters.json', 'utf8'));
    characterData = json['characterData'];

    // Create file if it doesn't exist
    if(!fs.existsSync('resources/txt/randomized.txt')) {
        var fd = fs.openSync('resources/txt/randomized.txt', 'w');
        fs.closeSync(fd);
        shuffleCharacters('resources/txt/characters.txt', 'resources/txt/randomized.txt', 'hard');
    }

    if(!fs.existsSync('resources/txt/randomizedNormal.txt')) {
        var fd = fs.openSync('resources/txt/randomizedNormal.txt', 'w');
        fs.closeSync(fd);
        shuffleCharacters('resources/txt/charactersNormal.txt', 'resources/txt/randomizedNormal.txt', 'hard');
    }

    getNewCharacter('resources/txt/randomized.txt', maxCharacters, 'hard');
    getNewCharacter('resources/txt/randomizedNormal.txt', maxNormalCharacters, 'normal');

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

    const serverJson = JSON.parse(fs.readFileSync('/disk/haikyuudle/json/haikyuu-server-info.json', 'utf8'));

    currentGame = serverJson['currentDay'];

    maxCharacters = serverJson['maxCharacters'];
    if(currentGame % serverJson['maxCharacters'] === 0) {
        console.log('Reset')
        shuffleCharacters('resources/txt/characters.txt', 'resources/txt/randomized.txt', 'hard');
    } else if(currentGame % serverJson['maxNormalCharacters'] === 0) {
        shuffleCharacters('resources/txt/charactersNormal.txt', 'resources/txt/randomizedNormal.txt', 'normal');
    }
    else {
        getNewCharacter('resources/txt/randomized.txt', maxCharacters, 'hard');
        getNewCharacter('resources/txt/randomizedNormal.txt', maxNormalCharacters, 'normal');
    }

    // Save today's information in the server JSON
    serverJson['currentDay'] = currentGame++;
    serverJson['currentCharacter'] = todayCharacter.name;
    serverJson['currentNormalCharacter'] = todayNormalCharacter.name;
    serverJson['maxCharacters'] = maxCharacters;
    serverJson['maxNormalCharacters'] = maxNormalCharacters;

    fs.writeFile('/disk/haikyuudle/json/haikyuu-server-info.json', JSON.stringify(serverJson), (error) => {
        if (error) throw error;
    });

    // Now that the day has reset, make a new day entry in the winner JSON
    const winnerJson = JSON.parse(fs.readFileSync('resources/json/haikyuudle-winners.json', 'utf8'));
    const strDate = date.getFullYear() + '-' + date.toLocaleString('default', { month: 'numeric' }) + '-' + date.getDate();
    const initValues = [
        {"1": 0},
        {"2": 0},
        {"3": 0},
        {"4": 0},
        {"5": 0},
        {"6": 0},
        {"7": 0},
        {"8": 0},
        {"9+": 0}
    ];
    winnerJson[strDate + '-normal'] = initValues;
    winnerJson[strDate + '-hard'] = initValues;

    fs.writeFile('resources/json/haikyuudle-winners.json', JSON.stringify(winnerJson), (error) => {
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
                    }
                    else if(mode === 'hard') {
                        todayCharacter = character;
                       console.log(`${currentGame} Today's Hard Mode character: ${todayCharacter.name}`);
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
        getNewCharacter('resources/txt/randomizedNormal.txt', maxNormalCharacters, 'normal');
     }
     else if(mode === 'hard') {
        getNewCharacter('resources/txt/randomized.txt', maxCharacters, 'hard');
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