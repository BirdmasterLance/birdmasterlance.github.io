
var todayCharacter;
var todayNormalCharacter;
var endlessCharacter;
var numGuesses = 0;
var currentGame = 0;
var lightMode = false;
var mode = 0; // 0 = normal mode, 1 = hard mode
var chart;
var timeouts = [];
var searchSelectedTeam = '';
var searchSelectedPosition = '';
var goToTopOfCharacters = false;

// Get the character that matches the query
// from a list of character names
async function getCharacters(query, doneCallback) {
    const response = await fetch('./resources/json/haikyuu-characters.json');
    const json = await response.json();
    let characters = mode === 0 ? json['characterNamesNormal'] : json['characterNames'];

    var results = [];
    // For each name in the list, we are going to compare it to the query
    // It simply checks if the first or last name starts with the query
    // It also checks if the full name matches
    // If we wanna get fancy, we could add contains or fuzzy search
    characters.forEach(element => {
        const splitName = element.toLowerCase().split(' ');
        const fullNameReverse = splitName[1] + ' ' + splitName[0];
        if( splitName[0].startsWith(query.toLowerCase()) || 
            splitName[1].startsWith(query.toLowerCase()) ||
            element.toLowerCase().startsWith(query.toLowerCase()) ||
            fullNameReverse.startsWith(query.toLowerCase())) {
            
            // For this jQuery library, the results have to be in this format
            var jsonData = {};
            jsonData['value'] = element;
            jsonData['data'] = element;
            results.push(jsonData);   
        }
    });

    doneCallback( { suggestions: results } );
}

// Gets a random character from the JSON
async function getRandomCharacter() {
    const response = await fetch('./resources/json/haikyuu-characters.json');
    const json = await response.json();
    let characterNames = json['characterNames'];
    let randomIndex = Math.floor(Math.random() * characterNames.length);
    endlessCharacterName = characterNames[randomIndex];
    let characters = json['characterData'];
    for(let i = 0; i < characters.length; i++) {
        if(characters[i].name === endlessCharacterName) {
            localStorage.setItem('endlessChar', JSON.stringify(characters[i]));
            break;
        }
    }
}

// Do something when a character is selected
async function getResults(suggestion) {

    const response = await fetch('./resources/json/haikyuu-characters.json');
    const json = await response.json();
    characterData = json['characterData'];

    // Based on the selected suggestion, find the JSON from the list of character data
    // Since this JSON isn't going to be too large (maybe like 200 at best), it'll probably be ok to do it like this
    characterData.forEach(character => {
        if(character.name === suggestion.data) {

            // Save guess into localStorage
            switch (mode) {
                case 0:
                    let guessesNormal = JSON.parse(localStorage.getItem('guessesNormal'));
                    guessesNormal.push(character);
                    localStorage.setItem('guessesNormal', JSON.stringify(guessesNormal));
                    break;
                case 1:
                    let guesses = JSON.parse(localStorage.getItem('guesses'));
                    guesses.push(character);
                    localStorage.setItem('guesses', JSON.stringify(guesses));
                    break;
                case 2:
                    let guessesEndless = JSON.parse(localStorage.getItem('guessesEndless'));
                    guessesEndless.push(character);
                    localStorage.setItem('guessesEndless', JSON.stringify(guessesEndless));
                    break;
            }

            checkCharacter(character) 
        }
    });
}

// When a character is selected, compare them to today's character
// And give the player information so they can guess again
async function checkCharacter(character) {

    // TOOD: update this so it can also take games from previous days
    switch(mode) {
        case 0:
            checkToCharacter = todayNormalCharacter;
            break;
        case 1:
            checkToCharacter = todayCharacter;
            break;
        case 2:
            checkToCharacter = JSON.parse(localStorage.getItem('endlessChar'));
            break;
    }

    // Increment the number of guesses for stat keeping
    numGuesses += 1;

    var trueMatch = true;

    // Clear out the textbox
    const searchBox = document.getElementById('autocomplete');
    searchBox.value = "";

    let answerRow = jQuery('#answer-row');

    if(numGuesses === 1) {
        if(lightMode) {
            answerRow.append(`<div id="category-row" class="flex flex-row justify-center width-auto">
                <div class="square square-light">Image</div>
                <div class="square square-light">Name</div>
                <div class="square square-light">Gender</div>
                <div class="square square-light">School</div>
                <div class="square square-light">Position</div>
                <div class="square square-light">Number</div>
                <div class="square square-light">Height</div>
                <div class="square square-light">Year</div>
            </div>`);
        } else {
            answerRow.append(`<div id="category-row" class="flex flex-row justify-center width-auto">
                <div class="square">Image</div>
                <div class="square">Name</div>
                <div class="square">Gender</div>
                <div class="square">School</div>
                <div class="square">Position</div>
                <div class="square">Number</div>
                <div class="square">Height</div>
                <div class="square">Year</div>
            </div>`);
        }
    }

    else if(numGuesses === 3) {
        if(lightMode) document.getElementById('characters-btn').classList.add('option-update-light');
        else document.getElementById('characters-btn').classList.add('option-update');
        goToTopOfCharacters = true;
        setupCharacterList(numGuesses, '');
        setupPositionSearchList(numGuesses);
    }

    else if(numGuesses === 5) {
        if(lightMode) document.getElementById('characters-btn').classList.add('option-update-light');
        else document.getElementById('characters-btn').classList.add('option-update');
        goToTopOfCharacters = true;
        setupTeamSearchList(numGuesses);
    }
    else if(numGuesses === 7) {
        if(lightMode) document.getElementById('characters-btn').classList.add('option-update-light');
        else document.getElementById('characters-btn').classList.add('option-update');
        goToTopOfCharacters = true;
        setupCharacterList(numGuesses, '');
        setupPositionSearchList(numGuesses);
        setupTeamSearchList(numGuesses);
    } else {
        if(document.getElementById('characters-btn').classList.contains('option-update')) document.getElementById('characters-btn').classList.remove('option-update');
        if(document.getElementById('characters-btn').classList.contains('option-update-light')) document.getElementById('characters-btn').classList.remove('option-update-light');
    }

    let rowHTML = '<div id="row' + numGuesses + '" class="flex flex-row justify-center width-auto">';

    // Check name
    var charNameSlice = character.name;
    if(character.name.includes("(Timeskip)")) {
        charNameSlice = charNameSlice.slice(0, -11);
    }
    if(character.name === checkToCharacter.name || checkToCharacter.name.includes(character.name) || charNameSlice === checkToCharacter.name) {
        rowHTML += '<img src="resources/images/character_images/' + character.image + '" class="square correct-square-image animation-fade-in" style="animation-delay: 150ms;">';
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 300ms;">' + character.name + '</div>';
    } else {
        rowHTML += '<img src="resources/images/character_images/' + character.image + '" class="square incorrect-square-image animation-fade-in" style="animation-delay: 150ms;">';
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 300ms;">' + character.name + '</div>';
        trueMatch = false;
    }

    // Check school
    if(character.gender === checkToCharacter.gender) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 450ms;">' + character.gender + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 450ms;">' + character.gender + '</div>';
        trueMatch = false;
    }

    // Check school
    if(character.school === checkToCharacter.school) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 600ms;">' + character.school + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 600ms;">' + character.school + '</div>';
        trueMatch = false;
    }

    // Check position
    if(character.position === checkToCharacter.position) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 750ms;">' + character.position + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 750ms;">' + character.position + '</div>';
        trueMatch = false;
    }

    // Check jersey number
    if(character.number === checkToCharacter.number) {
        if(character.number === -1) {
            rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 900ms; font-size: 18px;">' + 'N/A' + ' ✓</div>';
        } else {
            rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 900ms; font-size: 18px;">' + character.number + ' ✓</div>';
        }
    }
    else if(character.number > checkToCharacter.number) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 900ms; font-size: 18px;">' + character.number + ' ▼</div>';
        trueMatch = false;
    }
    else if(character.number < checkToCharacter.number) {
        if(character.number === -1) {
            rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 900ms; font-size: 18px;">' + 'N/A' + ' ▲</div>';
        } else {
            rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 900ms; font-size: 18px;">' + character.number + ' ▲</div>';
        }
        trueMatch = false;
    }

    // Check height
    if(character.height === checkToCharacter.height) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 1050ms; font-size: 18px;">' + character.height + ' ✓</div>';
    }
    else if(character.height > checkToCharacter.height) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1050ms; font-size: 18px;">' + character.height + ' ▼</div>';
        trueMatch = false;
    }
    else if(character.height < checkToCharacter.height) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1050ms; font-size: 18px;">' + character.height + ' ▲</div>';
        trueMatch = false;
    }

    // Check year
    if(character.year === checkToCharacter.year) {
        if(character.year === 4) {
            rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 1200ms; font-size: 18px;">' + 'Adult' + ' ✓</div>';
        } else {
            rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 1200ms; font-size: 18px;">' + character.year + ' ✓</div>';
        }
    }
    else if(character.year > checkToCharacter.year) {
        if(character.year === 4) {
            rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1200ms; font-size: 18px;">' + 'Adult' + ' ▼</div>';
        } else {
            rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1200ms; font-size: 18px;">' + character.year + ' ▼</div>';
        }
        trueMatch = false;
    }
    else if(character.year < checkToCharacter.year) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1200ms; font-size: 18px;">' + character.year + ' ▲</div>';
        trueMatch = false;
    }

    // Add guess row onto the page
    rowHTML += "</div>";


    $('#category-row').after(rowHTML);

    // answerRow.append(rowHTML);

    // Hide the search box until the animation finishes
    // searchBox.style.display = "none";

    if(trueMatch) { 
        setupCharacterList(0);
        $('#team-div').remove();
        $('#position-div').remove();
        searchBox.style.display = "none";
    }

    searchBox.disabled = true;
    searchBox.classList.add('disabled');
    searchBox.placeholder = '';
    let timeout = window.setTimeout(function() {
        // searchBox.style.display = "";

        if(trueMatch) { 
            // if(mode === 0) {
            //     if(localStorage.getItem('hasWon') === 'false') {
            //         if(lightMode) document.getElementById('mode-btn').classList.add('option-update-light');
            //         else document.getElementById('mode-btn').classList.add('option-update');
            //     }
            // }
            // document.getElementById('mode-btn').disabled = false;
            searchBox.style.display = "none";
            handleWin();
        }

        searchBox.disabled = false;
        searchBox.classList.remove('disabled');
        searchBox.placeholder = 'Search a character here';

    }, 2000);
    timeouts.push(timeout);
}

function handleWin() {
    // Add the winning animation to the final row
    $('#row' + numGuesses).children('img').each(function() {
        $(this).addClass('animation-square-jump');
    });
    $('#row' + numGuesses).children('div').each(function() {
        $(this).addClass('animation-square-jump');
    });

    // Ensure that the number of guesses and the guess history match
    // let guesses = JSON.parse(localStorage.getItem('guesses'));
    // var newGuesses = [];
    // for(var i = 0; i < numGuesses; i++) {
    //     newGuesses.push(guesses[i]);
    // }
    // localStorage.setItem('guesses', JSON.stringify(newGuesses));

    // Do stuff after that winning animations is done
    let timeout = window.setTimeout(function() {

        if(mode === 0 || mode === 1) {
            showShareButton();
            if(mode === 1 && localStorage.getItem('hasWon') === 'false') {
                // Save the stats in local storage
                localStorage.setItem('hasWon', 'true');
                let stats = JSON.parse(localStorage.getItem('statistics'));
                if(numGuesses < 9) {
                    stats[numGuesses]++;
                    localStorage.setItem('statistics', JSON.stringify(stats));
                } else {
                    stats['9+']++;
                    localStorage.setItem('statistics', JSON.stringify(stats));
                }
    
                // Send winner data back to server
                // fetch("https://birdmasterlance-github-io.onrender.com/receive", {
                //     method: "POST",
                //     body: JSON.stringify({
                //       mode: 'hard',
                //       numGuesses: numGuesses
                //     }),
                //     headers: {
                //       "Content-type": "application/json; charset=UTF-8"
                //     }
                //   });
                    // .then((response) => response.json())
                    // .then((json) => console.log(json));
            }
    
            if(mode === 0 && localStorage.getItem('hasWonNormal') === 'false') {
                // Save the stats in local storage
                localStorage.setItem('hasWonNormal', 'true');
                let stats = JSON.parse(localStorage.getItem('statisticsNormal'));
                if(numGuesses < 9) {
                    stats[numGuesses]++;
                    localStorage.setItem('statisticsNormal', JSON.stringify(stats));
                } else {
                    stats['9+']++;
                    localStorage.setItem('statisticsNormal', JSON.stringify(stats));
                }
                $('#endless-btn').prop('disabled', false);
    
                // Send winner data back to server
                // fetch("http://localhost:3000/receive", {
                //     method: "POST",
                //     body: JSON.stringify({
                //       mode: 'normal',
                //       numGuesses: numGuesses
                //     }),
                //     headers: {
                //       "Content-type": "application/json; charset=UTF-8"
                //     }
                //   });
                //     // .then((response) => response.json())
                //     // .then((json) => console.log(json));
            }
    
            // Update character list if player has won both modes
            if(localStorage.getItem('hasWon') === 'true' && localStorage.getItem('hasWonNormal') === 'true') {
                setupCharacterList(10, '');
                setupPositionSearchList(10);
                setupTeamSearchList(10);
            } 
    
            updateChart();
        } else if(mode === 2) {
            showRandomButton();
            let stats = JSON.parse(localStorage.getItem('statisticsEndless'));
                if(numGuesses < 9) {
                    stats[numGuesses]++;
                    localStorage.setItem('statisticsEndless', JSON.stringify(stats));
                } else {
                    stats['9+']++;
                    localStorage.setItem('statisticsEndless', JSON.stringify(stats));
                }
        } else if(mode === 3) {
            
        }
        // const searchBox = document.getElementById('autocomplete');
        // searchBox.value = "";
        // searchBox.style.display = 'none';

        $('#autocomplete').hide();

    }, 2600);
    timeouts.push(timeout);


    if(document.getElementById('characters-btn').classList.contains('option-update')) {
        document.getElementById('characters-btn').classList.remove('option-update');
    }
    if(document.getElementById('characters-btn').classList.contains('option-update-light')) {
        document.getElementById('characters-btn').classList.remove('option-update-light');
    }
    
}

function showShareButton() {

    if($('.share-btn').length === 0) {
        const topRow = jQuery('#top-row');
        let shareBtn = '<div><div class="share-btn" id="discord-btn">Share (Discord)</div><div class="share-btn" id="no-discord-btn">Share (Other)</div></div>'
        topRow.append(shareBtn);
    }

    // Generate the text upon clicking the share button
    $('#discord-btn').click(function() {
        generateShare(true);
    });

    $('#no-discord-btn').click(function() {
        generateShare(false);
    });
}

// Unfortunately reuses the comparision code from above
function generateShare(discord) {

    alert('Copied to clipboard!');

    let shareText = '';

    //🟥 🟩

    let checkToCharacter;
    let guesses;
    let haikyuudleMode = '';
    if(mode === 0) {
        checkToCharacter = todayNormalCharacter;
        guesses = JSON.parse(localStorage.getItem('guessesNormal'));
        haikyuudleMode = 'Haikyuudle!!';
    } else if (mode === 1) {
        checkToCharacter = todayCharacter;
        guesses = JSON.parse(localStorage.getItem('guesses'));
        haikyuudleMode = 'Haikyuudle!! (Hard Mode)';
    }

    if(discord) {
        shareText = `[${haikyuudleMode}](<https://birdmasterlance.github.io/haikyuudle>) #${currentGame}\n`;
    } else {
        shareText = `${haikyuudleMode} #${currentGame}\n`;
    }

    if(numGuesses > 1) {
        shareText += `Correctly guessed in ${numGuesses} tries.\n`;
    }
    else {
        shareText += `Correctly guessed in 1 try!\n`;
    }

    for(let i = guesses.length-1; i >= 0; i--) {
        let character = guesses[i];
        let charNameSlice = character.name;
        // Check name
        if(character.name.includes("(Timeskip)")) {
            charNameSlice = charNameSlice.slice(0, -11);
        }
        if(character.name === checkToCharacter.name || checkToCharacter.name.includes(character.name) || charNameSlice === checkToCharacter.name) {
            shareText += "🟩";
            shareText += "🟩";
        }
        else {
            shareText += "🟥";
            shareText += "🟥";
        }

        // Check school
        if(character.gender === checkToCharacter.gender) {
            shareText += "🟩";
        }
        else {
            shareText += "🟥";
        }

        // Check school
        if(character.school === checkToCharacter.school) {
            shareText += "🟩";
        }
        else {
            shareText += "🟥";
        }

        // Check position
        if(character.position === checkToCharacter.position) {
            shareText += "🟩";
        }
        else {
            shareText += "🟥";
        }

        // Check jersey number
        if(character.number === checkToCharacter.number) {
            shareText += "🟩";
        }
        else if(character.number > checkToCharacter.number) {
            shareText += "⬇️";
        }
        else if(character.number < checkToCharacter.number) {
            shareText += "⬆️";
        }

        // Check height
        if(character.height === checkToCharacter.height) {
            shareText += "🟩";
        }
        else if(character.height > checkToCharacter.height) {
            shareText += "⬇️";
        }
        else if(character.height < checkToCharacter.height) {
            shareText += "⬆️";
        }

        // Check year
        if(character.year === checkToCharacter.year) {
            shareText += "🟩";
        }
        else if(character.year > checkToCharacter.year) {
            shareText += "⬇️";
        }
        else if(character.year < checkToCharacter.year) {
            shareText += "⬆️";
        }        
        shareText += "\n";
    }
    
    if(!discord) {
        shareText += 'https://birdmasterlance.github.io/haikyuudle';
    }

    navigator.clipboard.writeText(shareText);
}

function showRandomButton() {
    if($('.random-btn').length === 0) {
        const topRow = jQuery('#top-row');
        let shareBtn = '<div class="random-btn" id="random-btn">Get a new character!</div>'
        topRow.append(shareBtn);
    }


    // Generate the text upon clicking the share button
    $('#random-btn').click(function() {
        resetBoard();
        localStorage.setItem('guessesEndless', JSON.stringify([]));
        getRandomCharacter();
        $('.random-btn').remove();
    });
}

// Get the data on today's character
async function getTodayCharacter() {

    await fetch('https://birdmasterlance-github-io.onrender.com/test', {method:'GET'})
    .then(async function(response){
        if (response.ok) {
            const json = await response.json();
            todayCharacter = json.character;
            todayNormalCharacter = json. normalModeCharacter;
            currentGame = json.currentGame;

            if(json.version !== localStorage.getItem('version')) {
                if(lightMode) document.getElementById('news-btn').classList.add('option-update-light');
                else document.getElementById('news-btn').classList.add('option-update');
                localStorage.setItem('version', json.version);
            }

            $('#current-day').append(` ${json.currentGame}`);
            // $('#current-winners').append(`${json.numWinners} have guessed correctly today`);

            if(localStorage.getItem('lastPlayed') !== json.currentDate) {
                localStorage.setItem('guesses', JSON.stringify([]));
                localStorage.setItem('guessesNormal', JSON.stringify([]));
                localStorage.setItem('guessesEndless', JSON.stringify([]));
                localStorage.setItem('guessesPast', JSON.stringify([]));
                localStorage.setItem('hasWon', false);
                localStorage.setItem('hasWonNormal', false);
                $('.share-btn').remove();
                $('#endless-btn').prop('disabled', true);
                getRandomCharacter();
            } else {
                switch (mode) {
                    case 0:
                        const guessesNormal = JSON.parse(localStorage.getItem('guessesNormal'));
                        guessesNormal.forEach(character => {
                            checkCharacter(character);
                        });
                        break;
                    case 1:
                        const guesses = JSON.parse(localStorage.getItem('guesses'));
                        guesses.forEach(character => {
                            checkCharacter(character);
                        });
                        break;
                }
            }

            // Set date after all the checks for the server's current date
            localStorage.setItem('lastPlayed', json.currentDate);
        }
    });
}

function setUpChart() {
    let xValues = [];
    let yValues = [];
    let totalGames = 0;
    const stats = JSON.parse(localStorage.getItem('statisticsNormal'));
    for(var i in stats) {
        xValues.push(i);
        yValues.push(stats[i]);
        totalGames += stats[i];
    }

    $('#total-games').text('Total Games: ' + totalGames);

    chart = new Chart("stats-chart", {
        type: "horizontalBar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: ['#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff','#fff'],
                data: yValues
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: [{
                    border: {
                      color: 'red'
                    }
                }],
                y: [{
                    border: {
                      color: 'red'
                    }
                }],
                xAxes: [{
                    display: false,
                    gridLines: { 
                        color: '#3b261e'
                    },
                    ticks: {
                        stepSize: 1,
                        fontColor: "#fff"
                    }
                }],
                yAxes: [{
                    barPercentage: 1,
                    gridLines: { 
                        color: '#3b261e'
                    },
                    ticks: {
                        fontColor: "#fff"
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                titleColor: '#fff',
                bodyColor: '#fff',
                footerColor: '#fff',
                yAlign: 'center',
                backgroundColor: '#000',
                callbacks: {
                    labelColor: function(context) {
                        return {
                            // borderColor: 'rgb(255, 255, 255)',
                            backgroundColor: '#fff',
                            borderWidth: 2,
                            borderDash: [2, 2],
                            borderRadius: 2,
                            padding: 20,
                        };
                    },
                    labelTextColor: function(context) {
                        return '#ffffff';
                    }
                }
            },
            hover: {
                mode: null
            }
            // layout: {
            //     padding: {
            //        bottom: 25  //set that fits the best
            //     }
            // }
        }
    });
}

function updateChart() {

    let xValues = [];
    let yValues = [];
    let totalGames = 0;
    let stats;
    if (mode === 0) {
        stats = JSON.parse(localStorage.getItem('statisticsNormal'));
    } else if(mode === 1) {
        stats = JSON.parse(localStorage.getItem('statistics'));
    } else if(mode === 2) {
        stats = JSON.parse(localStorage.getItem('statisticsEndless'));
    }

    for(var i in stats) {
        xValues.push(i);
        yValues.push(stats[i]);
        totalGames += stats[i];
    }

    $('#total-games').text('Total Games: ' + totalGames);

    let chartColor = '#fff';
    let lineColor = '#3b261e';
    let tooltipColor = '#000';
    if(lightMode) {
        chartColor = '#000';
        lineColor = '#e3c9be';
        tooltipCOlor = '#fff';
    }

    chart.data.datasets[0].data = yValues;
    chart.data.datasets[0].backgroundColor = chartColor;

    chart.options = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: [{
                border: {
                  color: 'red'
                }
            }],
            y: [{
                border: {
                  color: 'red'
                }
            }],
            xAxes: [{
                display: false,
                gridLines: { 
                    color: lineColor
                },
                ticks: {
                    stepSize: 1,
                    fontColor: chartColor
                }
            }],
            yAxes: [{
                barPercentage: 1,
                gridLines: { 
                    color: lineColor
                },
                ticks: {
                    fontColor: chartColor
                }
            }]
        },
        legend: {
            display: false
        },
        tooltips: {
            titleColor: chartColor,
            bodyColor: chartColor,
            footerColor: chartColor,
            yAlign: 'center',
            backgroundColor: tooltipColor,
            callbacks: {
                labelColor: function(context) {
                    return {
                        // borderColor: 'rgb(255, 255, 255)',
                        backgroundColor: chartColor,
                        borderWidth: 2,
                        borderDash: [2, 2],
                        borderRadius: 2,
                        padding: 20,
                    };
                },
                labelTextColor: function(context) {
                    return '#ffffff';
                }
            }
        },
        hover: {
            mode: null
        }
        // layout: {
        //     padding: {
        //        bottom: 25  //set that fits the best
        //     }
        // }
    }

    chart.update();

}

async function setupModal() {

    $('#help-btn').click(function() {
        $('#help-modal').css('display', 'block');
    });
    
    $('#characters-btn').click(function() {
        if(document.getElementById('characters-btn').classList.contains('option-update')) document.getElementById('characters-btn').classList.remove('option-update');
        if(document.getElementById('characters-btn').classList.contains('option-update-light')) document.getElementById('characters-btn').classList.remove('option-update-light');
        $('#characters-modal').css('display', 'block');
        if(goToTopOfCharacters === true)
        {
            goToTopOfCharacters = false;
            $('.characters-modal').scrollTop(0);
        }
    });
    
    $('#stats-btn').click(function() {
        updateChart();
        $('#stats-modal').css('display', 'block');
    });

    $('#mode-btn').click(function() {
        $('#mode-modal').css('display', 'block');
    });

    $('#news-btn').click(function() {
        if(document.getElementById('news-btn').classList.contains('option-update')) document.getElementById('news-btn').classList.remove('option-update');
        $('#news-modal').css('display', 'block');
        $('.news-modal').scrollTop(0);
    });

    $('.light-dark-mode-btn').click(toggleLightMode);

    // Get the modal
    var helpModal = document.getElementById("help-modal");
    var charactersModal = document.getElementById("characters-modal");
    var statsModal = document.getElementById("stats-modal");
    var modeModal = document.getElementById("mode-modal")
    var newsModal = document.getElementById("news-modal");
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if(event.target == helpModal) {
            helpModal.style.display = 'none';
        }
        else if(event.target == charactersModal) {
            charactersModal.style.display = 'none';
        }
        else if (event.target == statsModal) {
            statsModal.style.display = 'none';
        }
        else if(event.target == modeModal) {
            modeModal.style.display = 'none';
        }
        else if(event.target == newsModal) {
            newsModal.style.display = 'none';
        }
    } 

    $('.close-btn').click(function() {
        helpModal.style.display = 'none';
        charactersModal.style.display = 'none';
        statsModal.style.display = 'none';
        modeModal.style.display = 'none';
        newsModal.style.display = 'none';
    });
}

async function setupCharacterList(guesses, school, position) {

    const response = await fetch('./resources/json/haikyuu-characters.json');
    const json = await response.json();
    $('#character-list').text(''); // Reset the text before adding to it

    let characterNames = mode === 0 ? json['characterNamesNormal'] : json['characterNames'];

    if(guesses < 3) {
        let sortedCharacters = characterNames.sort();
        sortedCharacters.forEach((characterName) => {
            $('#character-list').append(`<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName}.png"><p>${characterName}</p></div>`);
        });
        $('#position-div').remove();
        $('#team-div').remove();
    } else {
        let characterData = json['characterData'];
        let characters = [];
        characterData.forEach((character) => { 
            if(characterNames.includes(character.name)) {
                characters.push(character);
            }
        });
        characters.sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
        });
        if(guesses >= 7) {
            // Sort again by year
            characters.sort(function (a, b) {
                if (a.year < b.year) {
                  return -1;
                }
                if (a.year > b.year) {
                  return 1;
                }
                return 0;
            });
        }

        // Since we know what position each character is in beforehand, let's just preemptively put it down
        let wingSpikers = [];
        let setters = [];
        let middleBlockers = [];
        let liberos = [];
        let managers = [];
        let coaches = [];
        characters.forEach((character) => {
            switch(character.position) {
                case 'Wing Spiker':
                    wingSpikers.push(character);
                    break;
                case 'Setter':
                    setters.push(character);
                    break;
                case 'Middle Blocker':
                    middleBlockers.push(character);
                    break;
                case 'Libero':
                    liberos.push(character);
                    break;
                case 'Manager':
                    managers.push(character);
                    break;
                case 'Coach':
                    coaches.push(character);
                    break;
            }
        });

        var characterListStr = '';
        var addedCharacter = false;

        if(school === '') {
                    
            if(position === 'Wing Spiker') {
                // List of every character without any school sorting
                characterListStr += lightMode ? '<h2 class="h2-light">Wing Spikers</h2>' : '<h2>Wing Spikers</h2>';
                wingSpikers.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                });
            } else if(position === 'Setter') {
                characterListStr += lightMode ? '<br><h2 class="h2-light">Setters</h2>' : '<br><h2>Setters</h2>';
                setters.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                }); 
            } else if(position === 'Middle Blocker') {
                characterListStr += lightMode ? '<br><h2 class="h2-light">Middle Blockers</h2>' : '<br><h2>Middle Blockers</h2>';
                middleBlockers.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                });
            } else if(position === 'Libero') {
                characterListStr += lightMode ? '<br><h2 class="h2-light">Liberos</h2>' : '<br><h2>Liberos</h2>';
                liberos.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                });
            } else if(position === 'Manager') {
                characterListStr += lightMode ? '<br><h2 class="h2-light">Managers</h2>' : '<br><h2>Managers</h2>';
                managers.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                });
            } else if(position === 'Coach') {
                characterListStr += lightMode ? '<br><h2 class="h2-light">Coaches</h2>' : '<br><h2>Coaches</h2>';
                coaches.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                });
            } else {
                // Make wing spiker the default case
                characterListStr += lightMode ? '<h2 class="h2-light">Wing Spikers</h2>' : '<h2>Wing Spikers</h2>';
                wingSpikers.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                });
                characterListStr += lightMode ? '<br><h2 class="h2-light">Setters</h2>' : '<br><h2>Setters</h2>';
                setters.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                }); 
                characterListStr += lightMode ? '<br><h2 class="h2-light">Middle Blockers</h2>' : '<br><h2>Middle Blockers</h2>';
                middleBlockers.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                });
                characterListStr += lightMode ? '<br><h2 class="h2-light">Liberos</h2>' : '<br><h2>Liberos</h2>';
                liberos.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                });
                characterListStr += lightMode ? '<br><h2 class="h2-light">Managers</h2>' : '<br><h2>Managers</h2>';
                managers.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                });
                characterListStr += lightMode ? '<br><h2 class="h2-light">Coaches</h2>' : '<br><h2>Coaches</h2>';
                coaches.forEach((characterName) => {
                    characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                    if(guesses >= 7) {
                        if(characterName.year === 4) {
                            characterListStr += `, Adult</p></div>`;
                        } else {
                            characterListStr += `, Year ${characterName.year}</p></div>`;
                        }
                    } else {
                        characterListStr += '</p></div>'
                    }
                });
            }
            $('#character-list').append(characterListStr);

        } else {
            
            // List of characters per school
            if(position === 'Wing Spiker') {
                characterListStr = lightMode ? '<h2 class="h2-light">Wing Spikers</h2>' : '<h2>Wing Spikers</h2>';
                wingSpikers.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
            } else if(position === 'Setter') {
                characterListStr = lightMode ? '<br><h2 class="h2-light">Setters</h2>' : '<br><h2>Setters</h2>';
                setters.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
            } else if(position === 'Middle Blocker') {
                characterListStr = lightMode ? '<br><h2 class="h2-light">Middle Blockers</h2>' : '<br><h2>Middle Blockers</h2>';
                middleBlockers.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
            } else if(position === 'Libero') {
                characterListStr = lightMode ? '<br><h2 class="h2-light">Liberos</h2>' : '<br><h2>Liberos</h2>';
                liberos.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
            } else if(position === 'Manager') {
                characterListStr = lightMode ? '<br><h2 class="h2-light">Managers</h2>' : '<br><h2>Managers</h2>';
                managers.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
            } else if(position === 'Coach') {
                characterListStr = lightMode ? '<br><h2 class="h2-light">Coaches</h2>' : '<br><h2>Coaches</h2>';
                coaches.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
            } else {
                characterListStr = lightMode ? '<h2 class="h2-light">Wing Spikers</h2>' : '<h2>Wing Spikers</h2>';
                wingSpikers.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
                characterListStr = lightMode ? '<br><h2 class="h2-light">Setters</h2>' : '<br><h2>Setters</h2>';
                setters.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
                characterListStr = lightMode ? '<br><h2 class="h2-light">Middle Blockers</h2>' : '<br><h2>Middle Blockers</h2>';
                middleBlockers.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
                characterListStr = lightMode ? '<br><h2 class="h2-light">Liberos</h2>' : '<br><h2>Liberos</h2>';
                liberos.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
                characterListStr = lightMode ? '<br><h2 class="h2-light">Managers</h2>' : '<br><h2>Managers</h2>';
                managers.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
                characterListStr = lightMode ? '<br><h2 class="h2-light">Coaches</h2>' : '<br><h2>Coaches</h2>';
                coaches.forEach((characterName) => {
                    if(characterName.school === school) {
                        characterListStr +=  `<div class="flex flex-row"><img class="square list-square-image" src="resources/images/character_images/${characterName.image}"><p>${characterName.name}`;
                        if(guesses >= 7) {
                            if(characterName.year === 4) {
                                characterListStr += `, Adult</p></div>`;
                            } else {
                                characterListStr += `, Year ${characterName.year}</p></div>`;
                            }
                        } else {
                            characterListStr += '</p></div>'
                        }
                        addedCharacter = true;
                    }
                });
                if(addedCharacter) $('#character-list').append(characterListStr);
                addedCharacter = false;
            }
        }
    }
}

async function setupPositionSearchList(guesses) {
    // Create select list HTML
    let select = '<div id="position-div"><p>Position Sort</p><select id="position-search">' +
    '<option value="">All</option>' +
    '<option value="Wing Spiker">Wing Spiker</option>' +
    '<option value="Setter">Setter</option>' +
    '<option value="Middle Blocker">Middle Blocker</option>' +
    '<option value="Libero">Libero</option>' +
    '<option value="Manager">Manager</option>' +
    '<option value="Coach">Coach</option>' +
    '</select></div>';

    // If position filter already exists, remove it
    if($('#position-div').length !== 0) {
        $('#position-div').remove();
    }

    // Add position filter to the modal
    $('.characters-modal').find('h1').after(select);

    // Add a listener for the select in character list
    positionSearch = document.getElementById("position-search");
    positionSearch.addEventListener('change', function() {
        searchSelectedPosition = this.value;
        setupCharacterList(guesses, searchSelectedTeam, this.value);
    }, false);
}

async function setupTeamSearchList(guesses) {
    
    // Get teams based on mode
    const response = await fetch('./resources/json/haikyuu-characters.json');
    const json = await response.json();
    let teams = mode === 0 ? json['teamNamesNormal'] : json['teamNames'];

    // Create select list HTML
    let select = '<div id="team-div"><p>Team Sort</p><select id="team-search"><option value="">All</option>';
    teams.forEach((teamName) => {
        select +=  `<option value="${teamName}">${teamName}</option>`;
    });
    select += '</select><br></div>'
    
    // If team filter already exists, remove it
    if($('#team-div').length !== 0) {
        $('#team-div').remove();
    }

    // Add team filter to the modal
    $('.characters-modal').find('h1').after(select);
    
    // Add a listener for the select in character list
    teamSearch = document.getElementById("team-search");
    teamSearch.addEventListener('change', function() {
        searchSelectedTeam = this.value;
        setupCharacterList(guesses, this.value, searchSelectedPosition);
    }, false);
}

async function changeMode(modeNum) {
    mode = modeNum;

    await resetBoard();

    switch (mode) {
        case 0:
            $('#current-day').text = `Haikyuudle No. ${currentGame}`;
            $('#title').text("WORDLE (Normal Mode)");
            $('#stats-title').text("Statistics (Normal Mode)");
            const guessesNormal = JSON.parse(localStorage.getItem('guessesNormal'));
            guessesNormal.forEach(character => {
                checkCharacter(character);
            });
            break;
        case 1:
            $('#current-day').text = `Haikyuudle No. ${currentGame}`;
            $('#title').text("WORDLE (Hard Mode)");
            $('#stats-title').text("Statistics (Hard Mode)");
            const guesses = JSON.parse(localStorage.getItem('guesses'));
            guesses.forEach(character => {
                checkCharacter(character);
            });
            break;
        case 2:
            $('#current-day').text = `Haikyuudle No. ${currentGame}`;
            $('#title').text("WORDLE (Endless Mode)");
            $('#stats-title').text("Statistics (Endless Mode)");
            const guessesEndless = JSON.parse(localStorage.getItem('guessesEndless'));
            guessesEndless.forEach(character => {
                checkCharacter(character);
            });
            break;
        case 3:
            $('#title').text("WORDLE (Past Normal Mode)");
            const guessesPastNormal = JSON.parse(localStorage.getItem('guessesPastNormal'));
            guessesPastNormal.forEach(character => {
                checkCharacter(character);
            });
            break;
        case 4:
            $('#title').text("WORDLE (Past Hard Mode)");
            const guessesPastHard = JSON.parse(localStorage.getItem('guessesPastHard'));
            guessesPastHard.forEach(character => {
                checkCharacter(character);
            });
            break;
    }
}

// Resets the guesses and search on screen
async function resetBoard() {
    if(document.getElementById('characters-btn').classList.contains('option-update')) {
        document.getElementById('characters-btn').classList.remove('option-update');
    }
    if(document.getElementById('mode-btn').classList.contains('option-update-light')) {
        document.getElementById('mode-btn').classList.remove('option-update-light');
    }

    // Hide and display share and search if necessary
    let answerRow = document.getElementById('answer-row');
    answerRow.textContent = '';
    $('.share-btn').remove();
    $('.random-btn').remove();
    $('#autocomplete').show();
    $('#autocomplete').prop('disabled', false);
    $('#autocomplete').prop('placeholder', 'Search a character here');
    $('#autocomplete').removeClass('disabled');

    goToTopOfCharacters = true;

    for(let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }

    // Reset search when switching modes
    searchSelectedPosition = '';
    searchSelectedTeam = '';
    await setupCharacterList(0);

    numGuesses = 0;
}

function toggleLightMode(alreadyLightMode) {

    lightMode = !lightMode;
    localStorage.setItem('lightMode', lightMode);

    var icon = document.getElementById('light-dark-mode-icon')
    if(lightMode) {
        icon.innerHTML = 'dark_mode';
        if(document.getElementById('news-btn').classList.contains('option-update')) {
            document.getElementById('news-btn').classList.remove('option-update');
            document.getElementById('news-btn').classList.add('option-update-light');
        }
        if(document.getElementById('characters-btn').classList.contains('option-update')) {
            document.getElementById('characters-btn').classList.remove('option-update');
            document.getElementById('characters-btn').classList.add('option-update-light');
        }
    } else {
        icon.innerHTML = 'light_mode';
        if(document.getElementById('news-btn').classList.contains('option-update-light')) {
            document.getElementById('news-btn').classList.remove('option-update-light');
            document.getElementById('news-btn').classList.add('option-update');
        }
        if(document.getElementById('characters-btn').classList.contains('option-update-light')) {
            document.getElementById('characters-btn').classList.remove('option-update-light');
            document.getElementById('characters-btn').classList.add('option-update');
        }
    }

    // $('#stats-chart').remove();
    // $('#total-games').after('<canvas id="stats-chart"></canvas>')

    document.body.classList.toggle('body-light');
    document.getElementById('autocomplete').classList.toggle('input-light');

    const h1Elements = document.getElementsByTagName('h1');
    for(let i = 0; i < h1Elements.length; i++) {
        h1Elements.item(i).classList.toggle('h1-light');
    }
    const h2Elements = document.getElementsByTagName('h2');
    for(let i = 0; i < h2Elements.length; i++) {
        h2Elements.item(i).classList.toggle('h2-light');
    }
    const pElements = document.getElementsByTagName('p');
    for(let i = 0; i < pElements.length; i++) {
        pElements.item(i).classList.toggle('p-light');
    }
    const squareElements = document.getElementsByClassName('square');
    for(let i = 0; i < squareElements.length; i++) {
        squareElements.item(i).classList.toggle('square-light');
    }
    const optElements = document.getElementsByClassName('option-btn');
    for(let i = 0; i < optElements.length; i++) {
        optElements.item(i).classList.toggle('option-btn-light');
    }
    const topElements = document.getElementsByClassName('top-btn');
    for(let i = 0; i < topElements.length; i++) {
        topElements.item(i).classList.toggle('top-btn-light');
    }
    const modeBtnElements = document.getElementsByClassName('mode-btn');
    for(let i = 0; i < modeBtnElements.length; i++) {
        modeBtnElements.item(i).classList.toggle('mode-btn-light');
    }
    
    const suggElements = document.getElementsByClassName('autocomplete-suggestions');
    for(let i = 0; i < suggElements.length; i++) {
        suggElements.item(i).classList.toggle('autocomplete-suggestions-light');
    }
    const selElements = document.getElementsByClassName('autocomplete-selected');
    for(let i = 0; i < selElements.length; i++) {
        selElements.item(i).classList.toggle('autocomplete-selected-light');
    }

    const helpElements = document.getElementsByClassName('help-modal');
    for(let i = 0; i < helpElements.length; i++) {
        helpElements.item(i).classList.toggle('help-modal-light');
    }
    const charsElements = document.getElementsByClassName('characters-modal');
    for(let i = 0; i < charsElements.length; i++) {
        charsElements.item(i).classList.toggle('characters-modal-light');
    }
    const statsElements = document.getElementsByClassName('stats-modal');
    for(let i = 0; i < statsElements.length; i++) {
        statsElements.item(i).classList.toggle('stats-modal-light');
    }
    const modeElements = document.getElementsByClassName('mode-modal');
    for(let i = 0; i < modeElements.length; i++) {
        modeElements.item(i).classList.toggle('mode-modal-light');
    }
    const newsElements = document.getElementsByClassName('news-modal');
    for(let i = 0; i < newsElements.length; i++) {
        newsElements.item(i).classList.toggle('news-modal-light');
    }
    const ldmElements = document.getElementsByClassName('light-dark-mode-btn');
    for(let i = 0; i < ldmElements.length; i++) {
        ldmElements.item(i).classList.toggle('light-dark-mode-btn-light');
    }
    const closeElements = document.getElementsByClassName('close-btn');
    for(let i = 0; i < closeElements.length; i++) {
        closeElements.item(i).classList.toggle('close-btn-light');
    }
    const tooltipElements = document.getElementsByClassName('tooltip');
    for(let i = 0; i < tooltipElements.length; i++) {
        tooltipElements.item(i).classList.toggle('tooltip-light');
    }
    const squareImageElements = document.getElementsByClassName('list-square-image');
    for(let i = 0; i < squareElements.length; i++) {
        squareImageElements.item(i).classList.toggle('list-square-image-light');
    }
}

// jQuery autocomplete library
// This is how it works
$('#autocomplete').autocomplete({
    lookup: function (query, doneCallback) {
        getCharacters(query, doneCallback);
    },
    onSelect: function (suggestion) {
        getResults(suggestion);
    }
});

if(localStorage.getItem('guesses') === null) {
    var emptyArray = [];
    localStorage.setItem('guesses', JSON.stringify(emptyArray));
}
if(localStorage.getItem('guessesNormal') === null) {
    var emptyArray = [];
    localStorage.setItem('guessesNormal', JSON.stringify(emptyArray));
}
if(localStorage.getItem('guessesEndless') === null) {
    var emptyArray = [];
    localStorage.setItem('guessesEndless', JSON.stringify(emptyArray));
}
// if(localStorage.getItem('guessesPastNormal') === null) {
//     var emptyArray = [];
//     localStorage.setItem('guessesPastNormal', JSON.stringify(emptyArray));
// }
// if(localStorage.getItem('guessesPastHard') === null) {
//     var emptyArray = [];
//     localStorage.setItem('guessesPastHard', JSON.stringify(emptyArray));
// }

if(localStorage.getItem('endlessChar') === null) {
    getRandomCharacter();
}

if(localStorage.getItem('hasWon') === null) {
    localStorage.setItem('hasWon', 'false');
}
if(localStorage.getItem('hasWonNormal') === null) {
    localStorage.setItem('hasWonNormal', 'false');
}

if(localStorage.getItem('statistics') === null) {
    localStorage.setItem('statistics', JSON.stringify({"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9+": 0}));
} else {
    // Anyone with the old stats will need to be updated
    const stats = JSON.parse(localStorage.getItem('statistics'));
    if(stats['7+'] !== undefined) {
        stats['7'] = stats['7+'];
        delete stats['7+'];
        stats['8'] = 0;
        stats['9+'] = 0;
        localStorage.setItem('statistics', JSON.stringify(stats));
    }
    if(stats['9'] !== undefined) {
        stats['9+'] = stats['9'];
        delete stats['9'];
        localStorage.setItem('statistics', JSON.stringify(stats));
    }
    if(stats['8'] === undefined) {
        stats['8'] = 0;
        localStorage.setItem('statistics', JSON.stringify(stats));
    }
    if(stats['9+'] === undefined) {
        stats['9+'] = 0;
        localStorage.setItem('statistics', JSON.stringify(stats));
    }
}

if(localStorage.getItem('statisticsNormal') === null) {
    localStorage.setItem('statisticsNormal', JSON.stringify({"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9+": 0}));
}

if(localStorage.getItem('statisticsEndless') === null) {
    localStorage.setItem('statisticsEndless', JSON.stringify({"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9+": 0}));
}

// Show the necessary elements if someone has already won and is reloading the page
// $('.share-btn').remove();
// if(localStorage.getItem('hasWon') === 'true' || localStorage.getItem('hasWonNormal') === 'true') {
//     $('.autocomplete').hide();
//     showShareButton();
// }

if(localStorage.getItem('lightMode') === null) {
    localStorage.setItem('lightMode', false);
}

setUpChart();
if(localStorage.getItem('lightMode') === 'true') {
    toggleLightMode();
    lightMode = true;
    localStorage.setItem('lightMode', true);
}
if(localStorage.getItem('version') === null) {
    localStorage.setItem('version', '1.0.0');
    $('#help-modal').css('display', 'block');
    // If the player is a first time player, you can do something here
}

$('.top-btn').click(function() {
    $('.characters-modal').scrollTop(0);
});

$('#normal-mode-btn').click(function() {
    $('#mode-modal').css('display', 'none');
    changeMode(0);
});

$('#hard-mode-btn').click(function() {
    $('#mode-modal').css('display', 'none');
    changeMode(1);
});

$('#endless-btn').click(function() {
    $('#mode-modal').css('display', 'none');
    changeMode(2);
});

$('#past-normal-btn').click(function() {
    $('#mode-modal').css('display', 'none');
    changeMode(3);
});

$('#past-hard-btn').click(function() {
    $('#mode-modal').css('display', 'none');
    changeMode(4);
});


getTodayCharacter();
setupModal();
setupCharacterList(0);

// Always reset the search box upon reload
const searchBox = document.getElementById('autocomplete');
searchBox.value = "";