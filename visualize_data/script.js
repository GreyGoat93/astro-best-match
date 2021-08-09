let parsedData = JSON.parse(person);

let htmlList = document.getElementById('list');
let htmlSortBy = document.getElementById('sortBy');
let htmlShowExact = document.getElementById('showExact');
let htmlNameOfPerson = document.getElementById('nameOfPerson')
let htmlFromDay = document.getElementById('fromDay')
let htmlFromMonth = document.getElementById('fromMonth')
let htmlFromYear = document.getElementById('fromYear')
let htmlToDay = document.getElementById('toDay')
let htmlToMonth = document.getElementById('toMonth')
let htmlToYear = document.getElementById('toYear')
let htmlFilterButton = document.getElementById('filterButton')

let chunkSize = 500;

const listColumnQueue = ["day", "month", "year", "loving", "key", "passion", "emotional_pain",
"easy", "conflict", "combination"];

if( /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    chunkSize = 100;
}

const FILTERS = {
    sortBy: "date",
    showExact: false,
    fromDay: 1,
    fromMonth: 1,
    fromYear: 1900,
    toDay: 31,
    toMonth: 12,
    toYear: 2100,
}

let lastFilters = {
    ...FILTERS
}

let getSpecificDates = function(births){
    const {fromDay, fromMonth, fromYear, toDay, toMonth, toYear} = FILTERS;
    const fromDate = new Date(fromYear, fromMonth-1, fromDay).getTime();
    const toDate = new Date(toYear, toMonth-1, toDay).getTime();
    return births.filter(birth => {
        let _date = new Date(birth.year, birth.month-1, birth.day).getTime();
        return _date >= fromDate && _date <= toDate;
    })
}

let toggleButton = (state) => {
    if(state){
        htmlFilterButton.disabled = false;
        htmlFilterButton.classList.remove("button_disabled");
        htmlFilterButton.classList.add("button_enabled");
    } else {
        htmlFilterButton.disabled = true;
        htmlFilterButton.classList.remove("button_enabled");
        htmlFilterButton.classList.add("button_disabled");
    }
}

let checkFilterChange = () => {
    console.log(FILTERS);
    console.log(lastFilters)
    isChanged = false;
    for(let prop in lastFilters){
        if(lastFilters[prop] !== FILTERS[prop]){
            isChanged = true;
        }
    }
    toggleButton(isChanged)
}

let filter = function(){
    htmlList.innerText = "Loading..."
    let showExactAttribute = FILTERS.showExact ? "exact" : "not_exact";
    let exactized = parsedData.listOfBirths
    .map(birth => ({
        day: birth.day,
        month: birth.month,
        year: birth.year,
        ...birth[showExactAttribute],
    }));
    exactized = getSpecificDates(exactized);
    switch(FILTERS.sortBy){
        case "date":
            exactized
            .sort((a,b) => a.day - b.day)
            .sort((a,b) => a.month - b.month)
            .sort((a,b) => a.year - b.year)
        break;
        case "easy":
            exactized
            .sort((a,b) => a.conflict - b.conflict)
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.passion - a.passion)
            .sort((a,b) => b.loving - a.loving)
            .sort((a,b) => b.easy - a.easy)
        break;
        case "conflict":
            exactized
            .sort((a,b) => a.conflict - b.conflict)
            .sort((a,b) => b.emotional_pain - a.emotional_pain)
            .sort((a,b) => b.conflict - a.conflict)
        break;
        case "combination":
            exactized
            .sort((a,b) => a.conflict - b.conflict)
            .sort((a,b) => b.easy - a.easy)
            .sort((a,b) => b.combination - a.combination)
        case "loving":
            exactized
            .sort((a,b) => a.conflict - b.conflict)
            .sort((a,b) => b.easy - a.easy)
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.passion - a.passion)
            .sort((a,b) => b.loving - a.loving)
        break;
        case "key":
            exactized
            .sort((a,b) => a.conflict - b.conflict)
            .sort((a,b) => b.easy - a.easy)
            .sort((a,b) => b.loving - a.loving)
            .sort((a,b) => b.passion - a.passion)
            .sort((a,b) => b.key - a.key)
        break;
        case "passion":
            exactized
            .sort((a,b) => a.conflict - b.conflict)
            .sort((a,b) => b.easy - a.easy)
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.loving - a.loving)
            .sort((a,b) => b.passion - a.passion)
        break;
        case "emotional_pain":
            exactized
            .sort((a,b) => b.conflict - a.conflict)
            .sort((a,b) => b.emotional_pain - a.emotional_pain)
        break;
        case "lovely_three":
            exactized
            .sort((a,b) => a.conflict - b.conflict)
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.passion - a.passion)
            .sort((a,b) => b.loving - a.loving)
            .sort((a,b) => a.conflict - b.conflict)
            .sort((a,b) => b.easy - a.easy)
            .sort((a,b) => (b.loving + b.key + b.passion) - (a.loving + a.key + a.passion))
        break;
        case "hately_duo":
            exactized
            .sort((a,b) => b.emotional_pain - a.emotional_pain)
            .sort((a,b) => b.conflict - a.conflict)
            .sort((a,b) => (b.emotional_pain + b.conflict) - (a.emotional_pain + a.conflict))
        break;
    }
    exactized.length = chunkSize;
    return exactized;
}

let writeEveryBirthDays = function(birthdayArray){
    htmlList.innerText = ""
    birthdayArray.forEach(birthday => {
        let row = document.createElement("div");
        row.classList.add("list_items");
        listColumnQueue.forEach(column => {
            let _column = document.createElement("div")
            _column.classList.add("list_item");
            let _textNode = document.createTextNode(birthday[column].toString());
            _column.appendChild(_textNode);
            row.appendChild(_column);
        })
        htmlList.appendChild(row);
    })
}

let changeNameOfPerson = function(name){
    document.title = `${name}'s ideal matches <3`;
    htmlNameOfPerson.innerText = name;
}

let sortByEventHandler = function(e){
    FILTERS.sortBy = e.target.value;
    checkFilterChange();
}

let showExactEventHandler = function(e){
    FILTERS.showExact = e.target.checked;
    checkFilterChange();
}

let dateBetweenEventHandler = function(e){
    switch(e.target.id){
        case "fromDay":
            FILTERS.fromDay = parseInt(e.target.value)
        break;
        case "fromMonth":
            FILTERS.fromMonth = parseInt(e.target.value)
        break;
        case "fromYear":
            FILTERS.fromYear = parseInt(e.target.value)
        break;
        case "toDay":
            FILTERS.toDay = parseInt(e.target.value)
        break;
        case "toMonth":
            FILTERS.toMonth = parseInt(e.target.value)
        break;
        case "toYear":
            FILTERS.toYear = parseInt(e.target.value)
        break;
    }
    checkFilterChange();
}

let filterEventHandler = (e) => {
    lastFilters = {...FILTERS};
    toggleButton(false);
    let results = filter();
    writeEveryBirthDays(results);
}

htmlSortBy.addEventListener('input', sortByEventHandler)
htmlShowExact.addEventListener('input', showExactEventHandler)
htmlFromDay.addEventListener('input', dateBetweenEventHandler)
htmlFromMonth.addEventListener('input', dateBetweenEventHandler)
htmlFromYear.addEventListener('input', dateBetweenEventHandler)
htmlToDay.addEventListener('input', dateBetweenEventHandler)
htmlToMonth.addEventListener('input', dateBetweenEventHandler)
htmlToYear.addEventListener('input', dateBetweenEventHandler)
htmlFilterButton.addEventListener('click', filterEventHandler)

changeNameOfPerson(parsedData.name);

let initValues = [...parsedData.listOfBirths
.map(birth => ({
    day: birth.day,
    month: birth.month,
    year: birth.year,
    ...birth["not_exact"],
}))]
.sort((a,b) => a.day - b.day)
.sort((a,b) => a.month - b.month)
.sort((a,b) => a.year - b.year)
initValues.length = chunkSize;

writeEveryBirthDays(initValues);
