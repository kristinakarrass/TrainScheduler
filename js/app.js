  var config = {
      apiKey: "AIzaSyBJAWBNaJdiDHTx9rqA-0mUeoWFM_YlT74",
      authDomain: "my-awesome-project-a88cb.firebaseapp.com",
      databaseURL: "https://my-awesome-project-a88cb.firebaseio.com",
      storageBucket: "my-awesome-project-a88cb.appspot.com",
      messagingSenderId: "183049837448"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#submit").on("click", function() {
      //prevent page from reloading when enter is pressed
      event.preventDefault();
      //assigning variables with value of input form
      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrain = $("#firstTrain").val().trim();
      var frequency = $("#frequency").val().trim();
      // console.log(frequency);

      // First Time (pushed back 1 year to make sure it comes before current time)
      var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
      // console.log(firstTrainConverted);

      // Current Time when user checks the page
      var currentTime = moment();
      // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
      // console.log("DIFFERENCE IN TIME: " + diffTime);

      // Time apart (remainder)
      var remainder = diffTime % frequency;
      // console.log(remainder);

      // Minute Until Train
      var minutesAway = frequency - remainder;
      // console.log("Next Train is " + minutesAway + " minutes away.");

      // Next Train
      var nextTrain = moment().add(minutesAway, "minutes");
      var display = moment(nextTrain).format("hh:mm");
      var nextArrival = display;
      // console.log("Next Arrival: " + moment(nextTrain).format("hh:mm"));


  //storing data in firebase database
  database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency,
      nextArrival: nextArrival,      
      minutesAway: minutesAway     
  });
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrain").val("");
  $("#frequency").val("");
  });

  database.ref().on("child_added", function(childSnapshot) {
      // console.log(childSnapshot.val().trainName);
      // console.log(childSnapshot.val().destination);
      // console.log(childSnapshot.val().firstTrain);
      // console.log(childSnapshot.val().frequency);
      // console.log(childSnapshot.val().nextArrival);
      // console.log(childSnapshot.val().minutesAway);
        // $(".table").val("");
          var trainName = childSnapshot.val().trainName;
          var destination = childSnapshot.val().destination;
          var firstTrain = childSnapshot.val().firstTrain;
          var frequency = childSnapshot.val().frequency;
          console.log(trainName);
          console.log(destination);
          console.log(firstTrain);
          console.log(frequency);
          
          var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
          // console.log(firstTrainConverted);

          var currentTime = moment();
          console.log(moment(currentTime).format("hh:mm"));

          var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

          var remainder = diffTime % frequency;
          console.log(remainder);

          var minutesAway = frequency - remainder;
          console.log("Train is " + minutesAway + " minutes away.");

          var nextTrain = moment().add(minutesAway, "minutes");
          var display = moment(nextTrain).format("hh:mm");
          var nextArrival = display;
          console.log("next arrival " + nextArrival);

          // database.ref().set({
          //     trainName: trainName,
          //     destination: destination,
          //     firstTrain: firstTrain,
          //     frequency: frequency,
          //     nextArrival: nextArrival,
          //     minutesAway: minutesAway
          // });

      $(".table").append("<tr><td>" + trainName + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
  })
database.ref().updateChildren();