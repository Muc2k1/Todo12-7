const express = require('express');
const app = express();

const bodyParser = require('body-parser')

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
    apiKey: "AIzaSyBbiqmgNe_Od91L7ce5YP4woJKm8Ckzx-g",
    authDomain: "beex-982021-training.firebaseapp.com",
    projectId: "beex-982021-training",
    storageBucket: "beex-982021-training.appspot.com",
    messagingSenderId: "954361698343",
    appId: "1:954361698343:web:33f8d0e5715c8d78309602",
    measurementId: "G-WFHS5B68F6"
});

var db = firebase.firestore();
var todoList = [];

function refreshTL() {
    todoList = [];
    var counter = 0;
    db.collection("todos").get().then((snap) => {
        snap.forEach((doc) => {
            todoList.push(doc.data());
            todoList[counter].id = doc.id;
            counter++;
        });
    })
}

function fakeRefreshTL(callback) {
    todoList = [];
    var counter = 0;
    db.collection("todos").get()
        .then((snap) => {
            snap.forEach((doc) => {
                todoList.push(doc.data());
                todoList[counter].id = doc.id;
                counter++;
            });
        })
        .then(() => {
            callback();
        })
}

refreshTL();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
    res.render('index', { todos: todoList })
})

app.post('/', (req, res) => {
    db.collection("todos").add({
        content: req.body.content,
        status: "Chưa xong",
    }).then(() => {
        fakeRefreshTL(() => {
            res.redirect('/')
        })
    })
})

app.post('/delete', (req, res) => {
    var id = req.body.id
    db.collection("todos").doc(id).delete().then(() => {
        fakeRefreshTL(() => {
            res.redirect('/')
        })
    })
})

app.post('/update', (req, res) => {
    var st = JSON.parse(req.body.st);
    db.collection("todos").doc(st.id).update({
        "status": st.st
    })
        .then(() => {
            fakeRefreshTL(() => {
                res.redirect('/')
            })
        })
})

app.listen(9000, function () {
    console.log("On port: 9000")
});