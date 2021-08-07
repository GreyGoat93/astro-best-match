let parsedData = JSON.parse(person);

let htmlList = document.getElementById('list');
let htmlSortBy = document.getElementById('sortBy');
let htmlShowExact = document.getElementById('showExact');
let htmlNameOfPerson = document.getElementById('nameOfPerson')

const FILTERS = {
    sortBy: "date",
    showExact: false,
}

let filter = function(){
    let showExactAttribute = FILTERS.showExact ? "exact" : "not_exact";
    let exactized = parsedData.listOfBirths
    .map(birth => ({
        day: birth.day,
        month: birth.month,
        year: birth.year,
        ...birth[showExactAttribute],
    }));
    switch(FILTERS.sortBy){
        case "date":
            exactized
            .sort((a,b) => a.day - b.day)
            .sort((a,b) => a.month - b.month)
            .sort((a,b) => a.year - b.year)
        break;
        case "good":
            exactized
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.passion - a.passion)
            .sort((a,b) => b.loving - a.loving)
            .sort((a,b) => b.good - a.good)
        break;
        case "conflict":
            exactized
            .sort((a,b) => b.conflict - a.conflict)
            .sort((a,b) => b.emotional_pain - a.emotional_pain)
        break;
        case "loving":
            exactized
            .sort((a,b) => b.good - a.good)
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.passion - a.passion)
            .sort((a,b) => b.loving - a.loving)
        break;
        case "key":
        break;
        case "passion":
        break;
        case "emotional_pain":
        break;
    }
    console.log(exactized);
}

let changeNameOfPerson = function(name){
    document.title = `${name}'s ideal matches dates of birth`;
    htmlNameOfPerson.innerText = name;
}

let sortByEventHandler = function(e){
    FILTERS.sortBy = e.target.value;
    filter();
}

let showExactEventHandler = function(e){
    FILTERS.showExact = e.target.checked;
    filter();
}

htmlSortBy.addEventListener('input', sortByEventHandler)
htmlShowExact.addEventListener('input', showExactEventHandler)

changeNameOfPerson(parsedData.name);
