// Pretty much just copied over the class activity that we were doing for the
// Employee timesheet on saturday for template and wrote over variables and
// ID names, etc.

// When the document is ready
$(document).ready(function () {
    // Initializing the firebase connection
    var config = {
        apiKey: "AIzaSyDYY1gF-C3YHjSXjvhxBexNkLYyZQiYSVM",
        authDomain: "assignment-7-train-sched-1fac6.firebaseapp.com",
        databaseURL: "https://assignment-7-train-sched-1fac6.firebaseio.com",
        projectId: "assignment-7-train-sched-1fac6",
        storageBucket: "",
        messagingSenderId: "826550141307"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // Initializing all the variables to be used
    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = "";
    var trainTimeConverted = "";
    var currentTime = "";
    var differenceTime = "";
    var timeRemainder = "";
    var minutesUntilTrain = "";
    var nextTrainTime = "";
    var nextTrainTimeFormatted = "";
    
    // When the button with the add-train ID is clicked
    $("#add-train").on("click", function (event) {
        event.preventDefault();

        // Getting the values from the form
        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        trainTime = $("#train-time").val().trim();
        frequency = $("#frequency").val().trim();

        // Subtracting 1 day off the first train time so that it's always before the current time
        trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "days");

        // Storing the current time into the variable
        currentTime = moment();
        
        // Subtracting the current time by the first train time and storing it in minutes
        differenceTime = moment().diff(moment(trainTimeConverted), "minutes");
        
        // Getting the remainder of the difference in time divided by the frequency 
        timeRemainder = differenceTime % frequency;

        // Subtracting the remainder from the frequency to get minutes until the train arrives
        minutesUntilTrain = frequency - timeRemainder;

        // Adding those minutes to the current time for the next train time
        nextTrainTime = moment().add(minutesUntilTrain, "minutes");

        // Formatting it in HH:mm
        nextTrainTimeFormatted = moment(nextTrainTime).format("HH:mm");

        // Storing all these variables in a temporary train variable
        var tempTrain = {
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            nextTrainTimeFormatted: nextTrainTimeFormatted,
            minutesUntilTrain: minutesUntilTrain
        };

        // Pushing that variable out to firebase
        database.ref().push(tempTrain);

        // Emptying the form
        $("#train-name").val("");
        $("#destination").val("");
        $("#train-time").val("");
        $("#frequency").val("");
    })

    // When the firebase is updated with a child added to it
    database.ref().on("child_added", function (childSnapshot) {
        // Creating temporary tr
        var tempTR = $("<tr>");

        // Appending all the necessary variables to tr by making it a td first
        var td1 = $("<td>");
        td1.text(childSnapshot.val().trainName);
        tempTR.append(td1);

        var td2 = $("<td>");
        td2.text(childSnapshot.val().destination);
        tempTR.append(td2);

        var td3 = $("<td>");
        td3.text(childSnapshot.val().frequency);
        tempTR.append(td3);

        var td4 = $("<td>");
        td4.text(childSnapshot.val().nextTrainTimeFormatted);
        tempTR.append(td4);

        var td5 = $("<td>");
        td5.text(childSnapshot.val().minutesUntilTrain);
        tempTR.append(td5);

        // Button that will allow the user to remove a train when clicked on
        // This will be attempted as an extra feature
        var td6 = $("<button type=button>");
        td6.text("X");
        td6.addClass("btn btn-large delete-button");
        tempTR.append(td6);

        // Appending the temporary tr to the div with ID tbody
        $("#tbody").append(tempTR);
    }, function (errorObject) {
        // Error message
        console.log("Errors handled: " + errorObject.code);
    });

    /*
    $(".delete-button").on("click", function (event) {
        var line = $(this())
    })
    */
})