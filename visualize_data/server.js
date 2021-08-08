let fs = require("fs");
let express = require("express");
let ejs = require("ejs");
let app = express();

app.set('view-engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    const rawJson = fs.readFileSync('../list_of_births/taha.json');
    res.render('index.ejs', {person: rawJson});
})

app.listen(3000, () => {console.log("listening the app")});