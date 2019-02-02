
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBpA0990uBFSGg0nr0SFRVGhhmLjka097Y",
    authDomain: "rps-multiplayer-f1be7.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-f1be7.firebaseio.com",
    projectId: "rps-multiplayer-f1be7",
    storageBucket: "rps-multiplayer-f1be7.appspot.com",
    messagingSenderId: "1007061601250"
  };
  firebase.initializeApp(config);

// define variables
var database = firebase.database();
var started = false;
var count = 0;
var player1key = '';
var player1 = {
    name: '',
    turn: false,
    score: '',
    choice: '',
    diss: ''
};
var player2 = {
    name: '',
    turn: false,
    score: '',
    choice: '',
    diss: ''
};

if(started === true) {
    $('#hello').css({'display':'none'});
};


$('#add-player').on('click', function() {
    event.preventDefault();
    started = true;
    
    if(count === 0) {
        var input = $('#name-input').val();     
        player1.name = input;
        player1.turn = true;

        database.ref().push({
            player1: player1,
        });

    } else if(count === 1 && count < 2) {
        var input = $('#name-input').val();     
        player2.name = input;

        database.ref().push({
            player2: player2,
        });
    }
});

database.ref().on('child_added', function(snapshot) {
    count++;
    console.log(count);
    player1.turn = true;
    player1key = snapshot.key;
    console.log(snapshot.val(), snapshot.key);

    var snap = snapshot.val();
    if(count === 1) {
        var p1name = snap.player1.name;
        var p1score = snap.player1.score;
    
    $('#p1-name').text(p1name);
    $('#p1-score').text(p1score);
    } else if (count === 2) {
    var p2name = snap.player2.name;
    var p2score = snap.player2.score;

    $('#p2-name').text(p2name);
    $('#p2-score').text(p2score);
    }
    }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);

});

function player1Go() {
    var radioValue = $('input[name="p1"]:checked').val(); 
    player1.choice = radioValue;
    player2.turn = true;

    database.ref(player1key).update({
        player1: player1
    });  
}

function player2Go() {
    var radioValue = $('input[name="p2"]:checked').val(); 
    player2.choice = radioValue;

    database.ref().update({
        player2: player2
    });  
}

database.ref('users').on('value', function(snapshot) {
    console.log(snapshot);

    if(player1.choice != '' && player2.choice != '') {
        console.log('answers processed');
    }

    }, function(errorObject) {
    console.log('The read failed: ' + errorObject.code);

});

$('#p1go').on('click', function() {
    event.preventDefault();
    player1Go();

});

$('#p2go').on('click', function() {
    event.preventDefault();
    player2Go()
});
