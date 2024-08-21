
var todayCharacter;
var numGuesses = 0;
var currentGame = 0;
var lightMode = false;

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
        if(lightMode) {
            answerRow.append(`<div id="category-row" class="flex flex-row justify-center width-auto">
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

    else if(numGuesses === 5) {
        if(lightMode) document.getElementById('characters-btn').classList.add('option-update-light');
        else document.getElementById('characters-btn').classList.add('option-update');
        setupCharacterList(2);
    }

    else if(numGuesses === 8) {
        if(lightMode) document.getElementById('characters-btn').classList.add('option-update-light');
        else document.getElementById('characters-btn').classList.add('option-update');

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
    else {
        if(document.getElementById('characters-btn').classList.contains('option-update')) document.getElementById('characters-btn').classList.remove('option-update');
        if(document.getElementById('characters-btn').classList.contains('option-update-light')) document.getElementById('characters-btn').classList.remove('option-update-light');
    }

    let rowHTML = '<div id="row' + numGuesses + '" class="flex flex-row justify-center width-auto">';

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


    $('#category-row').after(rowHTML);

    // answerRow.append(rowHTML);

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

    if(document.getElementById('characters-btn').classList.contains('option-update')) {
        document.getElementById('characters-btn').classList.remove('option-update');
    }
    if(document.getElementById('characters-btn').classList.contains('option-update-light')) {
        document.getElementById('characters-btn').classList.remove('option-update-light');
    }
}

function showShareButton() {
    const topRow = jQuery('#top-row');
    let shareBtn = '<div><div class="share-btn" id="discord-btn">Share (Discord)</div><div class="share-btn" id="no-discord-btn">Share (Other)</div></div>'
    topRow.append(shareBtn);

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

    // TODO: add hyperlink to site
    let shareText = '';
    if(discord) {
        shareText = `[Haikyuudle!!](<https://birdmasterlance.github.io/haikyuudle>) #${currentGame}\n`;
    } else {
        shareText = `Haikyuudle!! #${currentGame}\n`;
    }

    if(numGuesses > 1) {
        shareText += `Correctly guessed in ${numGuesses} tries.\n`;
    }
    else {
        shareText += `Correctly guessed in 1 try!\n`;
    }
    //🟥 🟩

    const guesses = JSON.parse(localStorage.getItem('guesses'));
    for(let i = guesses.length-1; i >= 0; i--) {
        let character = guesses[i];
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
    }
    
    if(!discord) {
        shareText += 'https://birdmasterlance.github.io/haikyuudle';
    }

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

            if(json.version !== localStorage.getItem('version')) {
                if(lightMode) document.getElementById('news-btn').classList.add('option-update-light');
                else document.getElementById('news-btn').classList.add('option-update');
                localStorage.setItem('version', json.version);
            }

            $('#current-day').append(` ${json.currentGame}`);
            // $('#current-winners').append(`${json.numWinners} have guessed correctly today`);

            if(localStorage.getItem('lastPlayed') !== json.currentDate) {
                localStorage.setItem('guesses', JSON.stringify([]));
                localStorage.setItem('hasWon', false);
                $('.share-btn').remove();
            } else {
                const guesses = JSON.parse(localStorage.getItem('guesses'));
                guesses.forEach(character => {
                    checkCharacter(character);
                });
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
    const stats = JSON.parse(localStorage.getItem('statistics'));
    for(var i in stats) {
        xValues.push(i);
        yValues.push(stats[i]);
        totalGames += stats[i];
    }

    $('#total-games').text('Total Games: ' + totalGames);

    if(lightMode) {
        const statChart = new Chart("stats-chart", {
            type: "horizontalBar",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: ['black','black','black','black','black','black','black'],
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
                            color: "#e3c9be" 
                        },
                        ticks: {
                            stepSize: 1,
                            fontColor: "#000000"
                        }
                    }],
                    yAxes: [{
                        barPercentage: 1,
                        gridLines: { 
                            color: "#e3c9be" 
                        },
                        ticks: {
                            fontColor: "#000000"
                        }
                    }]
                },
                legend: {
                    display: false
                },
                tooltips: {
                    titleColor: '#000',
                    bodyColor: '#000',
                    footerColor: '#000',
                    yAlign: 'center',
                    backgroundColor: '#000000',
                    callbacks: {
                        labelColor: function(context) {
                            return {
                                // borderColor: 'rgb(255, 255, 255)',
                                backgroundColor: 'rgb(0, 0, 0)',
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
    } else {
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
                            color: "#3b261e" 
                        },
                        ticks: {
                            stepSize: 1,
                            fontColor: "#FFFFFF"
                        }
                    }],
                    yAxes: [{
                        barPercentage: 1,
                        gridLines: { 
                            color: "#3b261e" 
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
                    yAlign: 'center',
                    callbacks: {
                        labelColor: function(context) {
                            return {
                                // borderColor: 'rgb(0, 0, 255)',
                                backgroundColor: 'rgb(255, 255, 255)',
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

}

function setupModal() {

    $('#help-btn').click(function() {
        $('#help-modal').css('display', 'block');
    });
    
    $('#characters-btn').click(function() {
        if(document.getElementById('characters-btn').classList.contains('option-update')) document.getElementById('characters-btn').classList.remove('option-update');
        if(document.getElementById('characters-btn').classList.contains('option-update-light')) document.getElementById('characters-btn').classList.remove('option-update-light');
        $('#characters-modal').css('display', 'block');
        $('.characters-modal').scrollTop(0);
    });
    
    $('#stats-btn').click(function() {
        $('#stats-modal').css('display', 'block');
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
        else if(event.target == newsModal) {
            newsModal.style.display = 'none';
        }
    } 

    $('.close-btn').click(function() {
        helpModal.style.display = 'none';
        charactersModal.style.display = 'none';
        statsModal.style.display = 'none';
        newsModal.style.display = 'none';
    });
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
                    
            if(lightMode)  $('#character-list').append('<h2 class="h2-light">Wing Spikers</h2>');
            else $('#character-list').append('<h2>Wing Spikers</h2>');
            wingSpikers.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));
            if(lightMode)  $('#character-list').append('<br><h2 class="h2-light">Setters</h2>');
            else $('#character-list').append('<br><h2>Setters</h2>');
            setters.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));
            if(lightMode)  $('#character-list').append('<br><h2 class="h2-light">Middle Blockers</h2>');
            else $('#character-list').append('<br><h2>Middle Blockers</h2>');
            middleBlockers.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));
            if(lightMode)  $('#character-list').append('<br><h2 class="h2-light">Liberos</h2>');
            else $('#character-list').append('<br><h2>Liberos</h2>');
            liberos.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));
            if(lightMode)  $('#character-list').append('<br><h2 class="h2-light">Managers</h2>');
            else $('#character-list').append('<br><h2>Managers</h2>');
            managers.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));
            if(lightMode)  $('#character-list').append('<br><h2 class="h2-light">Coaches</h2>');
            else $('#character-list').append('<br><h2>Coaches</h2>');
            coaches.forEach((characterName) => $('#character-list').append(`<p>${characterName.name}</p>`));

        } else if(mode === 3) {
            if(lightMode)  $('#character-list').append('<h2 class="h2-light">Wing Spikers</h2>');
            else $('#character-list').append('<h2>Wing Spikers</h2>');
            wingSpikers.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
            if(lightMode)  $('#character-list').append('<br><h2 class="h2-light">Setters</h2>');
            else $('#character-list').append('<br><h2>Setters</h2>');
            setters.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
            if(lightMode)  $('#character-list').append('<br><h2 class="h2-light">Middle Blockers</h2>');
            else $('#character-list').append('<br><h2>Middle Blockers</h2>');
            middleBlockers.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
            if(lightMode)  $('#character-list').append('<br><h2 class="h2-light">Liberos</h2>');
            else $('#character-list').append('<br><h2>Liberos</h2>');
            liberos.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
            if(lightMode)  $('#character-list').append('<br><h2 class="h2-light">Managers</h2>');
            else $('#character-list').append('<br><h2>Managers</h2>');
            managers.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
            if(lightMode)  $('#character-list').append('<br><h2 class="h2-light">Coaches</h2>');
            else $('#character-list').append('<br><h2>Coaches</h2>');
            coaches.forEach((characterName) => {
                if(characterName.school === school) {
                    $('#character-list').append(`<p>${characterName.name}</p>`)
                }
            });
        }
    }
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

    $('#stats-chart').remove();
    $('#total-games').after('<canvas id="stats-chart"></canvas>')

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

    setUpChart();
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

if(localStorage.getItem('lightMode') === null) {
    localStorage.setItem('lightMode', false);
}
if(localStorage.getItem('lightMode') === 'true') {
    toggleLightMode();
    lightMode = true;
    localStorage.setItem('lightMode', true);
} else {
    setUpChart();
}

if(localStorage.getItem('version') === null) {
    localStorage.setItem('version', '1.0.0');
}



getTodayCharacter();
setupModal();
setupCharacterList(1);