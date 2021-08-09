let fs = require("fs");
let express = require("express");
let ejs = require("ejs");
let app = express();

let renderedHTML = "Loading...";

const compressHTML = (html) => {
    let htmlHeadIndex = html.indexOf('</head>');
    let htmlBodyIndex = html.indexOf('</body>');
    htmlBeforeHead = html.slice(0, htmlHeadIndex);
    htmlAfterHead = html.slice(htmlHeadIndex, htmlBodyIndex);
    htmlAfterBody = html.slice(htmlBodyIndex, html.length);
    let style = fs.readFileSync('./style.css');
    let script = fs.readFileSync('./script.js');
    return `${htmlBeforeHead}<style>${style}</style>${htmlAfterHead}<script>${script}</script>${htmlAfterBody}`;
}

app.set('view-engine', 'ejs');
app.set('views', __dirname)
const rawJson = fs.readFileSync('../list_of_births/taha.json');
app.render('index.ejs', {person: rawJson}, (err, html) => {
    renderedHTML = compressHTML(html);
})

app.get('/', (req, res) => {
    res.send(renderedHTML);
})

app.listen(3000, () => {console.log("listening the app")});