let parsedData = JSON.parse(person);

let htmlList = document.getElementById('list');
let htmlSortBy = document.getElementById('sortBy');
let htmlShowExact = document.getElementById('showExact');
let htmlNameOfPerson = document.getElementById('nameOfPerson')

const listColumnQueue = ["day", "month", "year", "loving", "key", "passion", "emotional_pain",
"easy", "conflict", "combination"];

const FILTERS = {
    sortBy: "date",
    showExact: false,
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
    switch(FILTERS.sortBy){
        case "date":
            exactized
            .sort((a,b) => a.day - b.day)
            .sort((a,b) => a.month - b.month)
            .sort((a,b) => a.year - b.year)
        break;
        case "easy":
            exactized
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.passion - a.passion)
            .sort((a,b) => b.loving - a.loving)
            .sort((a,b) => b.easy - a.easy)
        break;
        case "conflict":
            exactized
            .sort((a,b) => b.emotional_pain - a.emotional_pain)
            .sort((a,b) => b.conflict - a.conflict)
        break;
        case "loving":
            exactized
            .sort((a,b) => b.easy - a.easy)
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.passion - a.passion)
            .sort((a,b) => b.loving - a.loving)
        break;
        case "key":
            exactized
            .sort((a,b) => b.easy - a.easy)
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.loving - a.loving)
            .sort((a,b) => b.passion - a.passion)
        break;
        case "passion":
            exactized
            .sort((a,b) => b.easy - a.easy)
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.loving - a.loving)
            .sort((a,b) => b.passion - a.passion)
        break;
        case "emotional_pain":
            exactized
            .sort((a,b) => b.emotional_pain - a.emotional_pain)
            .sort((a,b) => b.conflict - a.conflict)
        break;
        case "lovely_three":
            exactized
            .sort((a,b) => b.easy - a.easy)
            .sort((a,b) => b.key - a.key)
            .sort((a,b) => b.passion - a.passion)
            .sort((a,b) => b.loving - a.loving)
            .sort((a,b) => (b.loving + b.key + b.passion) - (a.loving + a.key + a.passion))
        break;
        case "hately_duo":
            exactized
            .sort((a,b) => b.emotional_pain - a.emotional_pain)
            .sort((a,b) => b.conflict - a.conflict)
            .sort((a,b) => (b.emotional_pain + b.conflict) - (a.emotional_pain + a.conflict))
        break;
    }
    console.log(exactized);
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
    document.title = `${name}'s ideal matches dates of birth`;
    htmlNameOfPerson.innerText = name;
}

let sortByEventHandler = function(e){
    console.log("start");
    FILTERS.sortBy = e.target.value;
    let results = filter();
    console.log("taken");
    writeEveryBirthDays(results);
    console.log("finish");
}

let showExactEventHandler = function(e){
    FILTERS.showExact = e.target.checked;
    let results = filter();
    writeEveryBirthDays(results);
}

htmlSortBy.addEventListener('input', sortByEventHandler)
htmlShowExact.addEventListener('input', showExactEventHandler)

changeNameOfPerson(parsedData.name);

let initValues = parsedData.listOfBirths
.map(birth => ({
    day: birth.day,
    month: birth.month,
    year: birth.year,
    ...birth["not_exact"],
}))
.sort((a,b) => a.day - b.day)
.sort((a,b) => a.month - b.month)
.sort((a,b) => a.year - b.year)

writeEveryBirthDays(initValues);
