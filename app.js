// Pretty much just copied over the class activity that we were doing for the
// Employee timesheet on saturday for template and wrote over variables and
// ID names, etc.

$(document).ready(function () {
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

    var trainName = "";
    var destination = "";
    var trainTime = 0;
    var frequency = 0;

    $("#add-train").on("click", function (event) {
        event.preventDefault();

        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        trainTime = moment($("#train-time").val().trim(), "HH:mm").format("X");
        frequency = $("#frequency").val().trim();

        var tempTrain = {
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
        };

        database.ref().push(tempTrain);

        $("#train-name").val("");
        $("#destination").val("");
        $("#train-time").val("");
        $("#frequency").val("");
    })

    database.ref().on("child_added", function (childSnapshot) {
        var tempTR = $("<tr>");

        var td1 = $("<td>");
        td1.text(childSnapshot.val().trainName);
        tempTR.append(td1);

        var td2 = $("<td>");
        td2.text(childSnapshot.val().destination);
        tempTR.append(td2);

        var td3 = $("<td>");
        td3.text(childSnapshot.val().frequency);
        tempTR.append(td3);
        /*
        var actualtrainTime = moment.unix(childSnapshot.val().trainTime).format("MM/DD/YY");

        var mystartDate = childSnapshot.val().startDate;
        var monthsWorked = moment().diff(moment.unix(mystartDate, "X"), "months");
        console.log(monthsWorked);
        */
        var td4 = $("<td>");
        td4.text("Next Arrival");
        tempTR.append(td4);

        var td5 = $("<td>");
        td5.text("Minutes Away");
        tempTR.append(td5);

        var td6 = $("<button type=button>");
        td6.text("X");
        td6.addClass("btn btn-large delete-button");
        tempTR.append(td6);

        $("#tbody").append(tempTR);
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    /*
    $(".delete-button").on("click", function (event) {
        // reference correct firebase database key
        // delete that entire object?
    })
    */
})