
var todayCharacter;
var numGuesses = 0;
var currentGame = 0;

// Get the character that matches the quert
// from a list of character names
async function getCharacters(query, doneCallback) {
    const response = await fetch('./resources/json/haikyuu-characters.json');
    const json = await response.json();
    characters = json['characterNames'];

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
            let guesses = JSON.parse(localStorage.getItem('guesses'));
            guesses.push(character);
            localStorage.setItem('guesses', JSON.stringify(guesses));

            checkCharacter(character) 
        }
    });
}

// When a character is selected, compare them to today's character
// And give the player information so they can guess again
async function checkCharacter(character) {
    
    // Increment the number of guesses for stat keeping
    numGuesses += 1;
    
    var trueMatch = true;

    // Clear out the textbox
    const searchBox = document.getElementById('autocomplete');
    searchBox.value = "";

    let answerRow = jQuery('#answer-row');

    if(numGuesses === 1) {
        answerRow.append(`<div class="flex flex-row justify-center">
                    <div class="square">Name</div>
                    <div class="square">Gender</div>
                    <div class="square">School</div>
                    <div class="square">Position</div>
                    <div class="square">Number</div>
                    <div class="square">Height</div>
                    <div class="square">Year</div>
                </div>`);
    }

    else if(numGuesses === 5) {
        setupCharacterList(2);
    }

    else if(numGuesses === 8) {
        const response = await fetch('./resources/json/haikyuu-characters.json');
        const json = await response.json();
        teams = json['teamNames'];
        let select = '<select id="team-search"><option value="">---</option>';
        teams.forEach((teamName) => {
            select +=  `<option value="${teamName}">${teamName}</option>`;
        });
        select += '</select>'
        $('.characters-modal').find('h1').after(select);

        // Add a listener for the select in character list
        var selectEvent = document.getElementById("team-search");
        selectEvent.addEventListener('change', function() {
            setupCharacterList(3, this.value);
        }, false)
    }

    let rowHTML = '<div id="row' + numGuesses + '" class="flex flex-row justify-center">';

    // Check name
    if(character.name === todayCharacter.name) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 200ms;">' + character.name + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 200ms;">' + character.name + '</div>';
        trueMatch = false;
    }

    // Check school
    if(character.gender === todayCharacter.gender) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 400ms;">' + character.gender + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 400ms;">' + character.gender + '</div>';
        trueMatch = false;
    }

    // Check school
    if(character.school === todayCharacter.school) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 600ms;">' + character.school + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 600ms;">' + character.school + '</div>';
        trueMatch = false;
    }

    // Check position
    if(character.position === todayCharacter.position) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 800ms;">' + character.position + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 800ms;">' + character.position + '</div>';
        trueMatch = false;
    }

    // Check jersey number
    if(character.number === todayCharacter.number) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 1000ms; font-size: 18px;">' + character.number + ' ✓</div>';
    }
    else if(character.number > todayCharacter.number) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1000ms; font-size: 18px;">' + character.number + ' ▼</div>';
        trueMatch = false;
    }
    else if(character.number < todayCharacter.number) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1000ms; font-size: 18px;">' + character.number + ' ▲</div>';
        trueMatch = false;
    }

    // Check height
    if(character.height === todayCharacter.height) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 1200ms; font-size: 18px;">' + character.height + ' ✓</div>';
    }
    else if(character.height > todayCharacter.height) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1200ms; font-size: 18px;">' + character.height + ' ▼</div>';
        trueMatch = false;
    }
    else if(character.height < todayCharacter.height) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1200ms; font-size: 18px;">' + character.height + ' ▲</div>';
        trueMatch = false;
    }

    // Check year
    if(character.year === todayCharacter.year) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 1400ms; font-size: 18px;">' + character.year + ' ✓</div>';
    }
    else if(character.year > todayCharacter.year) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1400ms; font-size: 18px;">' + character.year + ' ▼</div>';
        trueMatch = false;
    }
    else if(character.year < todayCharacter.year) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1400ms; font-size: 18px;">' + character.year + ' ▲</div>';
        trueMatch = false;
    }

    // Add guess row onto the page
    rowHTML += "</div>";
    answerRow.append(rowHTML);

    // Hide the search box until the animation finishes
    searchBox.style.display = "none";
    window.setTimeout(function() {
        searchBox.style.display = "";

        if(trueMatch) { 
            searchBox.style.display = "none";
            handleWin();
        }
    }, 2000);
}

function handleWin() {
    // Add the winning animation to the final row
    $('#row' + numGuesses).children('div').each(function() {
        $(this).addClass('animation-square-jump');
    });

    // Don't do this if we've already won
    if(localStorage.getItem('hasWon') === 'false') {
        // Do stuff after that winning animations is done
        window.setTimeout(function() {
            showShareButton();
            localStorage.setItem('hasWon', 'true');

            // Save the stats in local storage
            let stats = JSON.parse(localStorage.getItem('statistics'));
            if(numGuesses < 7) {
                stats[numGuesses]++;
                localStorage.setItem('statistics', JSON.stringify(stats));
            } else {
                stats['7+']++;
                localStorage.setItem('statistics', JSON.stringify(stats));
            }

            // Update the stats chart
            setUpChart();
            
        }, 2600);
    }

    // const post = fetch("/test", {
    //     method: "POST",
    //     headers: {
    //         "Content-type": "application/json; charset=UTF-8"
    //     },
    //     body: JSON.stringify({'response': 'win'})
    //   });
}

function showShareButton() {
    const topRow = jQuery('#top-row');
    let shareBtn = '<div class="share-btn">Share</div>'
    topRow.append(shareBtn);

    // Generate the text upon clicking the share button
    $('div.share-btn').click(function() {
        generateShare();
    });
}

// Unfortunately reuses the comparision code from above
function generateShare() {

    alert('Copied to clipboard!');

    // TODO: add hyperlink to site
    let shareText = `[Haikyuudle]<link here> #${currentGame}\n`;
    if(numGuesses > 1) {
        shareText += `Correctly guessed in ${numGuesses} tries.\n`;
    }
    else {
        shareText += `Correctly guessed in 1 try!\n`;
    }
    //🟥 🟩

    const guesses = JSON.parse(localStorage.getItem('guesses'));
    guesses.forEach(character => {
        
        // Check name
        if(character.name === todayCharacter.name) {
            shareText += "🟩";
        }
        else {
            shareText += "🟥";
        }

        // Check school
        if(character.gender === todayCharacter.gender) {
            shareText += "🟩";
        }
        else {
            shareText += "🟥";
        }

        // Check school
        if(character.school === todayCharacter.school) {
            shareText += "🟩";
        }
        else {
            shareText += "🟥";
        }

        // Check position
        if(character.position === todayCharacter.position) {
            shareText += "🟩";
        }
        else {
            shareText += "🟥";
        }

        // Check jersey number
        if(character.number === todayCharacter.number) {
            shareText += "🟩";
        }
        else if(character.number > todayCharacter.number) {
            shareText += "⬇️";
        }
        else if(character.number < todayCharacter.number) {
            shareText += "⬆️";
        }

        // Check height
        if(character.height === todayCharacter.height) {
            shareText += "🟩";
        }
        else if(character.height > todayCharacter.height) {
            shareText += "⬇️";
        }
        else if(character.height < todayCharacter.height) {
            shareText += "⬆️";
        }

        // Check year
        if(character.year === todayCharacter.year) {
            shareText += "🟩";
        }
        else if(character.year > todayCharacter.year) {
            shareText += "⬇️";
        }
        else if(character.year < todayCharacter.year) {
            shareText += "⬆️";
        }        

        shareText += "\n";

    });

    navigator.clipboard.writeText(shareText);
}

// Get the data on today's character
async function getTodayCharacter() {

    let date = new Date();
    let currentDate = date.getFullYear() + ' ' + date.toLocaleString('default', { month: 'long' }) + ' ' + date.getDate();

    await fetch('https://birdmasterlance-github-io.onrender.com/test', {method:'GET'})
    .then(async function(response){
        if (response.ok) {
            const json = await response.json();
            todayCharacter = json.character;
            currentGame = json.currentGame;

            $('#current-day').append(` ${json.currentGame}`);
            // $('#current-winners').append(`${json.numWinners} have guessed correctly today`);

            if(localStorage.getItem('lastPlayed') !== json.currentDate) {
                localStorage.setItem('guesses', JSON.stringify([]));
                localStorage.setItem('hasWon', false);
            } else {
                const guesses = JSON.parse(localStorage.getItem('guesses'));
                guesses.forEach(character => {
                    checkCharacter(character);
                });
            }

            // Set date after all the checks for the server's current date
            localStorage.setItem('lastPlayed', currentDate);
        }
    });
}

function setUpChart() {
    let xValues = [];
    let yValues = [];
    let totalGames = 0;
    const stats = JSON.parse(localStorage.getItem('statistics'));
    for(var i in stats) {
        xValues.push(i);
        yValues.push(stats[i]);
        totalGames += stats[i];
    }

    $('#total-games').text('Total Games: ' + totalGames);

    const statsChart = new Chart("stats-chart", {
        type: "horizontalBar",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: ['white','white','white','white','white','white','white'],
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
                        color: "#453827" 
                    },
                    ticks: {
                        stepSize: 1,
                        fontColor: "#FFFFFF"
                    }
                }],
                yAxes: [{
                    barPercentage: 1,
                    gridLines: { 
                        color: "#453827" 
                    },
                    ticks: {
                        fontColor: "#FFFFFF"
                    }
                }]
            },
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                    llabelColor: function(context) {
                        return {
                            borderColor: 'rgb(0, 0, 255)',
                            backgroundColor: 'rgb(255, 0, 0)',
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
        }
    });

}

function setupModal() {

    $('#help-btn').click(function() {
        $('#help-modal').css('display', 'block');
    });
    
    $('#characters-btn').click(function() {
        $('#characters-modal').css('display', 'block');
    });
    
    $('#stats-btn').click(function() {
        $('#stats-modal').css('display', 'block');
    });

    // Get the modal
    var helpModal = document.getElementById("help-modal");
    var charactersModal = document.getElementById("characters-modal");
    var statsModal = document.getElementById("stats-modal");
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
    } 
}

async function setupCharacterList(mode, school) {

    const response = await fetch('./resources/json/haikyuu-characters.json');
    const json = await response.json();
    $('#character-list').text(''); // Reset the text before adding to it

    if(mode === 1) {
        characters = json['characterNames'];
        let sortedCharacters = characters.sort();
        sortedCharacters.forEach((characterName) => {
            $('#character-list').append(`<p>${characterName}</p>`);
        });
    } else {
        characters = json['characterData'];
        characters.sort(function (a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
        });

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

        if(mode === 2 || school === '') {
                    
            $('#character-list').append('<h2>Wing Spikers</h2>');
            wingSpikers.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));
            $('#character-list').append('<br><h2>Setters</h2>');
            setters.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));
            $('#character-list').append('<br><h2>Middle Blockers</h2>');
            middleBlockers.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));
            $('#character-list').append('<br><h2>Liberos</h2>');
            liberos.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));
            $('#character-list').append('<br><h2>Managers</h2>');
            managers.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));
            $('#character-list').append('<br><h2>Coaches</h2>');
            coaches.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));

        } else if(mode === 3) {
            $('#character-list').append('<h2>Wing Spikers</h2>');
            wingSpikers.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
            $('#character-list').append('<br><h2>Setters</h2>');
            setters.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
            $('#character-list').append('<br><h2>Middle Blockers</h2>');
            middleBlockers.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
            $('#character-list').append('<br><h2>Liberos</h2>');
            liberos.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
            $('#character-list').append('<br><h2>Managers</h2>');
            managers.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
            $('#character-list').append('<br><h2>Coaches</h2>');
            coaches.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
        }
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

if(localStorage.getItem('hasWon') === null) {
    localStorage.setItem('hasWon', 'false');
}

if(localStorage.getItem('statistics') === null) {
    localStorage.setItem('statistics', JSON.stringify({"1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7+": 0}));
}

// Show the necessary elements if someone has already won and is reloading the page
if(localStorage.getItem('hasWon') === 'true') {
    showShareButton();
} else {
    $('.share-btn').remove();
}

getTodayCharacter();
setUpChart();
setupModal();
setupCharacterList(1);
