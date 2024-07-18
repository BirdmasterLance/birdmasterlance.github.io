
var todayCharacterName = 'Sawamura Daichi';
var todayCharacter;

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
    var trueMatch = true;

    // Clear out the textbox
    const searchBox = document.getElementById('autocomplete');
    searchBox.value = "";

    let answerRow = jQuery('#answer-row');
    let rowHTML = '<div class="guess-row justify-center">';

    // Check name
    if(character.name === todayCharacter.name) {
        rowHTML += '<div class="correct-square">' + character.name + '</div>';
        console.log('same name');
    }
    else {
        rowHTML += '<div class="incorrect-square">' + character.name + '</div>';
        console.log('different name');
        trueMatch = false;
    }

    // Check school
    if(character.gender === todayCharacter.gender) {
        rowHTML += '<div class="correct-square">' + character.gender + '</div>';
        console.log('same gender');
    }
    else {
        console.log('different gender');
        rowHTML += '<div class="incorrect-square">' + character.gender + '</div>';
        trueMatch = false;
    }

    // Check school
    if(character.school === todayCharacter.school) {
        rowHTML += '<div class="correct-square">' + character.school + '</div>';
        console.log('same school');
    }
    else {
        rowHTML += '<div class="incorrect-square">' + character.school + '</div>';
        console.log('different school');
        trueMatch = false;
    }

    // Check jersey number
    if(character.number === todayCharacter.number) {
        rowHTML += '<div class="correct-square">' + character.number + '</div>';
        console.log('same jersey');
    }
    else if(character.number > todayCharacter.number) {
        rowHTML += '<div class="incorrect-square">' + character.number + '</div>';
        console.log('jersey too high');
        trueMatch = false;
    }
    else if(character.number < todayCharacter.number) {
        rowHTML += '<div class="incorrect-square">' + character.number + '</div>';
        console.log('jersey too low');
        trueMatch = false;
    }

    // Check position
    if(character.position === todayCharacter.position) {
        rowHTML += '<div class="correct-square">' + character.position + '</div>';
        console.log('same position');
    }
    else {
        rowHTML += '<div class="incorrect-square">' + character.position + '</div>';
        console.log('different position');
        trueMatch = false;
    }

    // Check height
    if(character.height === todayCharacter.height) {
        rowHTML += '<div class="correct-square">' + character.height + '</div>';
        console.log('same height');
    }
    else if(character.height > todayCharacter.height) {
        rowHTML += '<div class="incorrect-square">' + character.height + '</div>';
        console.log('height too high');
        trueMatch = false;
    }
    else if(character.height < todayCharacter.height) {
        rowHTML += '<div class="incorrect-square">' + character.height + '</div>';
        console.log('height too low');
        trueMatch = false;
    }

    // Check year
    if(character.year === todayCharacter.year) {
        rowHTML += '<div class="correct-square">' + character.year + '</div>';
        console.log('same year');
    }
    else if(character.year > todayCharacter.year) {
        rowHTML += '<div class="incorrect-square">' + character.year + '</div>';
        console.log('year too high');
        trueMatch = false;
    }
    else if(character.year < todayCharacter.year) {
        rowHTML += '<div class="incorrect-square">' + character.year + '</div>';
        console.log('year too low');
        trueMatch = false;
    }

    // Add guess row onto the page
    rowHTML += "</div>";
    answerRow.append(rowHTML);

    if(trueMatch) { 
        searchBox.remove();
        console.log("Correct!!");
    }
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