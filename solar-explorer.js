const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});


if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'))
}

app.listen(PORT, function() {
    console.log("solar explorer running on " + PORT)
})