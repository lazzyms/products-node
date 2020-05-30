const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")
const dotenv = require('dotenv')
dotenv.config()

const app = express()

var corsOptions = {
    origin: "http://localhost:8081"
}

app.use(cors(corsOptions))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')));

const db = require("./app/models")
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to the database!")
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err)
        process.exit()
    });

// middleware to authorise requests
var authorize = (req, res, next)  => {
    if(req.headers.authorization){
        console.log(req.headers.authorization)
        console.log(process.env.SECRETKEY)
        if(req.headers.authorization == process.env.SECRETKEY) {
            console.log('Authorised')
            next()
        } else {
            next('Authorization failed')
        }
    } else {
        next('Authorization token not found')
    }
}

app.use(authorize)

require("./app/routes/routes")(app)
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
});

module.exports = app