var config = {
    apiKey: "AIzaSyBJAWBNaJdiDHTx9rqA-0mUeoWFM_YlT74",
    authDomain: "my-awesome-project-a88cb.firebaseapp.com",
    databaseURL: "https://my-awesome-project-a88cb.firebaseio.com",
    storageBucket: "my-awesome-project-a88cb.appspot.com",
    messagingSenderId: "183049837448"
};
firebase.initializeApp(config);

var database = firebase.database();
//create function to update arrival time and minutes left every minute
function minuteUpdate() {
    $(".info").html("");
    //get values from database
    database.ref("trainValues/").once("value")
        .then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                    // get snapshots and put them in variables
                    var trainName = childSnapshot.val().trainName;
                    var destination = childSnapshot.val().destination;
                    var firstTrain = childSnapshot.val().firstTrain;
                    var frequency = childSnapshot.val().frequency;
                    var trainKey = childSnapshot.getKey();
                    //convert first train time and use it to calculate next arrival and minutes left
                    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
                    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
                    var remainder = diffTime % frequency;
                    var minutesAway = frequency - remainder;
                    var nextTrain = moment().add(minutesAway, "minutes");
                    var display = moment(nextTrain).format("LT");
                    var nextArrival = display;
                    // add new values to table
                        $(".table").append("<tr class='info'><td><button class= 'delete' value='" + trainKey + 
                                            "'>x</button></td><td value='trainName'>" + trainName + 
                                            "</td><td class='update' data-key='" + trainKey + "' value='" + destination + "'>" + destination + 
                                            "</td><td value='frequency'>" + frequency + 
                                            "</td><td value='nextArrival'>" + nextArrival + 
                                            "</td><td value='minutesAway'>" + minutesAway + "</td></tr>");

                }) //closes snapshot function
        }) //closes then function
}

//update values every minute by running minuteUpdate function
setInterval(minuteUpdate, 60000);

//function to submit user input
$("#submit").on("click", function() {
    //prevent page from reloading when enter is pressed
    event.preventDefault();
    //assigning variables with value of input form
    var trainName = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrain = $("#firstTrain").val().trim();
    var frequency = $("#frequency").val().trim();

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    // Current Time when user checks the page
    var currentTime = moment();
    // Difference between the times
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    // Time apart (remainder)
    var remainder = diffTime % frequency;
    // Minute Until Train
    var minutesAway = frequency - remainder;
    // Next Train
    var nextTrain = moment().add(minutesAway, "minutes");
    var display = moment(nextTrain).format("hh:mm");
    var nextArrival = display;

    //storing data in firebase database
    database.ref('trainValues/').push({
        trainName: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway
    });

    //emptying values in input boxes
    $("#trainName").val("");
    $("#destination").val("");
    $("#firstTrain").val("");
    $("#frequency").val("");
});

//getting values from database and displaying them in html (when site loads and after new train is added to database)
database.ref('trainValues/').on("child_added", function(childSnapshot) {
    //converting snapshots to variables
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrain = childSnapshot.val().firstTrain;
    var frequency = childSnapshot.val().frequency;
    var trainKey = childSnapshot.getKey();
    //converting time
    var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
    //getting time difference of first train to current time
    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
    // getting remainder by getting modulus
    var remainder = diffTime % frequency;
    // caluculating minutes to next Arrival
    var minutesAway = frequency - remainder;
    // add minutes to next arrival to current time
    var nextTrain = moment().add(minutesAway, "minutes");
    var display = moment(nextTrain).format("LT");
    var nextArrival = display;
    // appending all values to table in html
                        $(".table").append("<tr class='info'><td><button class= 'delete' value='" + trainKey + 
                                            "'>x</button></td><td value='trainName'>" + trainName + 
                                            "</td><td class='update' data-key='" + trainKey + "' value='" + destination + "'>" + destination + 
                                            "</td><td value='frequency'>" + frequency + 
                                            "</td><td value='nextArrival'>" + nextArrival + 
                                            "</td><td value='minutesAway'>" + minutesAway + "</td></tr>");

})



// deleting train from database identifying it by using firebase key
$(document).on("click", ".delete", function() {
    console.log($(this).val());
    var trainKey = $(this).val();
    database.ref('trainValues/').child(trainKey).remove();
})

//removing train data from table on website
database.ref('trainValues/').on("child_removed", function(childSnapshot) {
        //empty html of table completely
        $(".info").html("");
        //filling table with remaining data from firebase
        database.ref("trainValues/").once("value")
            .then(function(snapshot) {
                snapshot.forEach(function(childSnapshot) {
                        // get snapshots and put them in variables
                        var trainName = childSnapshot.val().trainName;
                        var destination = childSnapshot.val().destination;
                        var firstTrain = childSnapshot.val().firstTrain;
                        var frequency = childSnapshot.val().frequency;
                        var trainKey = childSnapshot.getKey();

                        var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");

                        // var currentTime = moment();

                        var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

                        var remainder = diffTime % frequency;

                        var minutesAway = frequency - remainder;

                        var nextTrain = moment().add(minutesAway, "minutes");
                        var display = moment(nextTrain).format("LT");
                        var nextArrival = display;
                        // add new values to table
                        $(".table").append("<tr class='info'><td><button class= 'delete' value='" + trainKey + 
                                            "'>x</button></td><td value='trainName'>" + trainName + 
                                            "</td><td class='update' data-key='" + trainKey + "' value='" + destination + "'>" + destination + 
                                            "</td><td value='frequency'>" + frequency + 
                                            "</td><td value='nextArrival'>" + nextArrival + 
                                            "</td><td value='minutesAway'>" + minutesAway + "</td></tr>");

                    }) // closes forEach childSnapshot function
            }) //closes then snapshot function
    }) //closes child_removed function

// // update single values in table
// $(document).on("click", ".update", function() {
//         event.preventDefault();
//         var updateKey = $(this).attr("data-key");
//         var childKey = $(this).attr("value");
//         var oldDestination = $(this).val().trim();
//         console.log(oldDestination);
//         console.log(childKey);
//         console.log(updateKey);
//         $(this).html("<td><input type='text' class='form-control' id='newDestination' placeholder='" + oldDestination + "'><button id='updateTrain' value='" + updateKey + "'>Update</button></td>");

//         // var updateValues = database.ref("trainValues/" + updateKey + childKey).once("value", function(snapshot) {
//         // // var trainName = snapshot.val().trainName;
//         // var destination = snapshot.val().destination;
//         // // var frequency = snapshot.val().frequency;
//         // // var firstTrain = snapshot.val().firstTrain;
//         // // var nextArrival = snapshot.val().nextArrival;
//         // // var minutesAway = snapshot.val().minutesAway;    
//         // // console.log(trainName);
//         // // console.log(destination);
//         // // console.log(frequency);
//         // // console.log(firstTrain);
//         // // console.log(nextArrival);
//         // // console.log(minutesAway);                
//         // });
//     })

// $(document).on("click", ".updateTrain", function(){
//     var newValue = $("#newDestination").val().trim();
//     console.log(newValue);
// })