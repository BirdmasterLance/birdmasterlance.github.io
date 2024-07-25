
var todayCharacterName = 'Iwaizumi Hajime';
var todayCharacter;

var testVar = 'test';
var numGuesses = 0;

// Get the character that matches the quert
// from a list of character names
async function getCharacters(query, doneCallback) {
    const response = await fetch('./haikyuu-characters.json');
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

    const response = await fetch('./haikyuu-characters.json');
    const json = await response.json();
    characterData = json['characterData'];

    // Based on the selected suggestion, find the JSON from the list of character data
    // Since this JSON isn't going to be too large (maybe like 200 at best), it'll probably be ok to do it like this
    characterData.forEach(character => {
        if(character.name === suggestion.data) {

            // Save guess into localStorage
            let guesses = JSON.parse(localStorage.getItem('guesses'));
            console.log(guesses);
            guesses.push(character);
            localStorage.setItem('guesses', JSON.stringify(guesses));

            checkCharacter(character) 
        }
    });
}

// When a character is selected, compare them to today's character
// And give the player information so they can guess again
function checkCharacter(character) {
    
    // Increment the number of guesses for stat keeping
    numGuesses += 1;
    console.log(numGuesses);
    
    var trueMatch = true;

    // Clear out the textbox
    const searchBox = document.getElementById('autocomplete');
    searchBox.value = "";

    let answerRow = jQuery('#answer-row');
    let rowHTML = '<div id="row' + numGuesses + '" class="flex flex-row justify-center">';

    // Check name
    if(character.name === todayCharacter.name) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 300ms;">' + character.name + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 300ms;">' + character.name + '</div>';
        trueMatch = false;
    }

    // Check school
    if(character.gender === todayCharacter.gender) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 600ms;">' + character.gender + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 600ms;">' + character.gender + '</div>';
        trueMatch = false;
    }

    // Check school
    if(character.school === todayCharacter.school) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 900ms;">' + character.school + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 900ms;">' + character.school + '</div>';
        trueMatch = false;
    }

    // Check jersey number
    if(character.number === todayCharacter.number) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 1200ms;">' + character.number + '</div>';
    }
    else if(character.number > todayCharacter.number) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1200ms;">' + character.number + ' ▼</div>';
        trueMatch = false;
    }
    else if(character.number < todayCharacter.number) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1200ms;">' + character.number + ' ▲</div>';
        trueMatch = false;
    }

    // Check position
    if(character.position === todayCharacter.position) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 1500ms;">' + character.position + '</div>';
    }
    else {
        rowHTML += '<div class="square incorrect-square animation-fade-in" style="animation-delay: 1500ms;">' + character.position + '</div>';
        trueMatch = false;
    }

    // Check height
    if(character.height === todayCharacter.height) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 1800ms;">' + character.height + '</div>';
    }
    else if(character.height > todayCharacter.height) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1800ms;">' + character.height + ' ▼</div>';
        trueMatch = false;
    }
    else if(character.height < todayCharacter.height) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 1800ms;">' + character.height + ' ▲</div>';
        trueMatch = false;
    }

    // Check year
    if(character.year === todayCharacter.year) {
        rowHTML += '<div class="square correct-square animation-fade-in" style="animation-delay: 2100ms;">' + character.year + '</div>';
    }
    else if(character.year > todayCharacter.year) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 2100ms;">' + character.year + ' ▼</div>';
        trueMatch = false;
    }
    else if(character.year < todayCharacter.year) {
        rowHTML += '<div class="square higher-lower-square animation-fade-in" style="animation-delay: 2100ms;">' + character.year + ' ▲</div>';
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
    }, 2800);
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

            // TODO: save stats

        }, 2600);
    }
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

    alert('copied!');

    let shareText = "Haikyuu Wordle #\n";
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

        // Check position
        if(character.position === todayCharacter.position) {
            shareText += "🟩";
        }
        else {
            shareText += "🟥";
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
    const response = await fetch('./haikyuu-characters.json');
    const json = await response.json();
    characterData = json['characterData'];

    // Based on the selected suggestion, find the JSON from the list of character data
    // Since this JSON isn't going to be too large (maybe like 200 at best), it'll probably be ok to do it like this
    characterData.forEach(character => {
        if(character.name === todayCharacterName) {
            todayCharacter = character;
        }
    });

    const guesses = JSON.parse(localStorage.getItem('guesses'));
    guesses.forEach(character => {
        checkCharacter(character);
    });
}
getTodayCharacter();

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

// Show the necessary elements if someone has already won and is reloading the page
if(localStorage.getItem('hasWon') === 'true') {
    console.log('already won');
    showShareButton();
}