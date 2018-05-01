// Pretty much just copied over the class activity that we were doing for the
// Employee timesheet on saturday for template and wrote over variables and
// ID names, etc.

// Initially setting the clock
$("#clock").html(moment().format('MMMM Do YYYY, HH:mm:ss'));

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
    var i = 1;

    // This will retireve the value of 'iteration' from the database
    function retrieveIteration() {
        return database.ref().once('value').then(function (snapshot) {
            i = snapshot.val().iteration;
        })
    }

    // Call the retrieveIteration function
    retrieveIteration();

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
        differenceTime = currentTime.diff(moment(trainTimeConverted), "minutes");

        // Getting the remainder of the difference in time divided by the frequency 
        timeRemainder = differenceTime % frequency;

        // Subtracting the remainder from the frequency to get minutes until the train arrives
        minutesUntilTrain = frequency - timeRemainder;

        // Adding those minutes to the current time for the next train time
        nextTrainTime = currentTime.add(minutesUntilTrain, "minutes");

        // Formatting it in HH:mm
        nextTrainTimeFormatted = moment(nextTrainTime).format("HH:mm");

        // Storing all these variables in a temporary train variable
        var train = {
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            nextTrainTimeFormatted: nextTrainTimeFormatted,
            minutesUntilTrain: minutesUntilTrain
        };

        // Emptying the form
        $("#train-name").val("");
        $("#destination").val("");
        $("#train-time").val("");
        $("#frequency").val("");

        // Pushing the new train object out to the database
        database.ref().child('trains/' + i).set(train);

        // Increment i
        i++;

        // Update the value of i in the database
        database.ref().update({ iteration: i });
    })

    // When the firebase is updated any time a value changes in the database
    database.ref().child("trains").on("value", function (snapshot) {
        // Empty #tbody table every time
        $("#tbody").empty();

        // Pretty much the loop for each train
        snapshot.forEach(function (childSnapshot) {
            // Storing the train's number as z so we can use it for the buttons down below
            var z = Object.keys(snapshot.val())[0];

            console.log(z);

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
            var td6 = $("<td>");
            var td6button = $("<button type=button>")
            td6button.html("<span class='glyphicon glyphicon-remove' aria-hidden='true'></span>")
            td6button.addClass("btn btn-large delete-button text-center");
            td6button.attr("data-number", z);
            td6.append(td6button);
            tempTR.append(td6);

            var td7 = $("<td>");
            var td7button = $("<button type=button>");
            td7button.html("<span class='glyphicon glyphicon-refresh' aria-hidden='true'></span>");
            td7button.addClass("btn btn-large update-button text-center");
            td7button.attr("data-number", z);
            td7.append(td7button);
            tempTR.append(td7);

            // Appending the temporary tr to the div with ID tbody
            $("#tbody").append(tempTR);

        });

    }, function (errorObject) {
        // Error message
        console.log("Errors handled: " + errorObject.code);
    });

    // Function to update the clock to its current time
    function update() {
        $("#clock").html(moment().format('MMMM Do YYYY, HH:mm:ss'));
    };

    // Calling the update function every second
    setInterval(update, 1000);

    // When the delete button is clicked on, remove the corresponding train from the database
    $(document).on("click", ".delete-button", function (event) {
        // Getting the data-number attribute of the button
        var j = $(this).attr("data-number");

        // Remove the corresponding train
        database.ref().child("trains/" + j).remove();
    });

    // When the update button is clicked on, update next arrival & minutes away in firebase
    $(document).on("click", ".update-button", function (event) {
        // Getting the data-number attribute of the button
        var k = $(this).attr("data-number");

        console.log(k);

        // Storing the specific train's path file in database in the variable reference
        var reference = database.ref().child("trains/" + k);

        reference.once('value').then(function (snapshot) {
            // Temporarily save the initial train time
            var tempTrainTime = snapshot.val().trainTime;

            // Temporarily save the frequency
            var tempFrequency = snapshot.val().frequency;

            // Subtracting 1 day off the first train time so that it's always before the current time
            var tempTrainTimeConverted = moment(tempTrainTime, "HH:mm").subtract(1, "days");

            // Storing the current time into the variable
            var tempCurrentTime = moment();

            // Subtracting the current time by the first train time and storing it in minutes
            var tempDifferenceTime = tempCurrentTime.diff(moment(tempTrainTimeConverted), "minutes");

            // Getting the remainder of the difference in time divided by the frequency 
            var tempTimeRemainder = tempDifferenceTime % tempFrequency;

            // Subtracting the remainder from the frequency to get minutes until the train arrives
            var tempMinutesUntilTrain = tempFrequency - tempTimeRemainder;

            // Adding those minutes to the current time for the next train time
            var tempNextTrainTime = tempCurrentTime.add(tempMinutesUntilTrain, "minutes");

            // Formatting it in HH:mm
            var tempNextTrainTimeFormatted = moment(tempNextTrainTime).format("HH:mm");

            reference.update({ minutesUntilTrain: tempMinutesUntilTrain, nextTrainTimeFormatted: tempNextTrainTimeFormatted });
        })
    })
})