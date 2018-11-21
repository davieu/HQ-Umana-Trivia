/////////////added
// const {createServer} = require('http');
////////////

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
// const port = process.env.PORT || 4000;
const bodyParser = require('body-parser');
const fs = require('fs');

///////////added
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const normalizePort = port => parseInt(port, 10);
const port = normalizePort(process.env.PORT || 4000);
const dev = app.get('env') !== 'production';
///////////

///////////added
if (!dev) {
    app.disable('x-powered-by');
    app.use(compression());
    app.use(morgan('common'));

    app.use(express.static(path.resolve(__dirname, 'build')));

    //'*' every request that comes in.
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'build', 'index.html'))
    });
};

if (dev) {
    app.use(morgan('dev'))
};
//////////

let questions = [];
let currentCorrectUsers = [];
let Users = [];
let currentQuestionNum = 1;
let maxQuestions = 5
let lobby = [];
let currentQuestion = null;
//this is the array for the shuffle.
let arr = [0, 1, 2, 3, 4];
// let arr = [0, 1];

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

fs.readFile(__dirname+"/qmana-questions.json", 'utf8', (err, data) => {
    if (err) throw err;
    questions = JSON.parse(data);
  });

//shuffle function for questions
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
//initial shuffle arr that is used to randomize questions
let shuffledArr = shuffle(arr)
console.log('outside:', shuffledArr)

function getNewQuestion() {
    // console.log('inside:', shuffledArr)
    // console.log('currentQuestionNum:', currentQuestionNum)
    // console.log('output:', [shuffledArr[currentQuestionNum - 1]])
    // console.log('question:', questions[shuffledArr[currentQuestionNum - 1]])
    return questions[shuffledArr[currentQuestionNum - 1]];

}

function nextQuestion(socket) {
    currentCorrectUsers = [];
    //grab a new question
    currentQuestion = getNewQuestion()  
    io.emit('new-question',(currentQuestion) )
        
    //set timer for question- set timer for 10secs. when timer finishes we send question complete
    var QuestionCountdown = setInterval(function(){
        //question complete msg will contain who got it right
        io.emit('question-complete', {'answer': currentQuestion.answer, 'currentCorrectUsers': currentCorrectUsers})
        //after sending question complete start another timer. wait 5secs. This timer will be to send next question.
        var NewQuestionCountdown = setInterval(function(){
            if (currentQuestionNum < maxQuestions) {
                currentQuestionNum++
                //add some logic to tell if you want to ask question or tell if game is over.
                nextQuestion(socket);
            }else {
                let poop = Users
                let jim = poop.map(cur => {return cur.username})
                console.log(jim)
                //send endgame message
                // io.emit('gameover', (currentCorrectUsers))
                io.emit('gameover', currentCorrectUsers)
                // io.emit('gameover', ([currentCorrectUsers, Users]))
                console.log('poop: ', currentCorrectUsers, [Users])
                // io.emit('gameover', (Users))
                console.log('users: ', Users)
                // io.emit('gameover', (Users))
                currentQuestionNum = 1
                shuffledArr = shuffle(arr)
            }
            clearInterval(NewQuestionCountdown);
        }, 5000);
        clearInterval(QuestionCountdown);
    }, 9000);
}
//num players screenLeft. count array
//hook up game over-screen
//lobby- players are waiting to start
//start game button will be in lobby page
//



function onConnection(socket) {
    console.log('connected', socket.id)
    socket.on('add-user', (data) => {
        let newUser = { username: data.username, id: socket.client.id }
        let myClient = [ { username: data.username, id: socket.client.id } ]
        Users.push(newUser)
        // myPlayer.push(myClient)
        console.log(Users)
        console.log(newUser)
        console.log(myClient)
        io.emit('new-player', (Users))
        socket.emit('my-player', (myClient))
        // socket.emit('new-player', (newUser))
        console.log('sending question');
        //takes in all logic for handling one funciton
        //keep track of how many question and how many left. counter for how many questions per game
        //load json file when server starts
    })

    socket.on('start-game', (data) => {
        nextQuestion(socket);
    })

    socket.on('choice', (data) => {
        if (data.answer === currentQuestion.answer ) {
            currentCorrectUsers.push(data.id)
            console.log('choice:', data)
        }
    })
}

app.get('/api/users', (request, response) => {
    return response.send(Users)
})

io.on('connection', onConnection);


http.listen(port, () => console.log('listening on port ' + port));

