// -------- DR Prediction Simulation --------

function predictDR(){

    const levels = [
        "Level 0 - No DR",
        "Level 1 - Mild",
        "Level 2 - Moderate",
        "Level 3 - Severe",
        "Level 4 - Proliferative DR"
    ];

    let randomLevel = levels[Math.floor(Math.random() * levels.length)];
    let confidence = Math.floor(Math.random() * 30) + 70;

    document.getElementById("result").innerHTML =
        "Prediction: <b>" + randomLevel + "</b><br>Confidence: " + confidence + "%";

    document.getElementById("lastPrediction").innerText = randomLevel;
    document.getElementById("riskScore").innerText = confidence + "%";

    // Save report
    let report = {
        level: randomLevel,
        confidence: confidence + "%",
        date: new Date().toLocaleDateString()
    };

    localStorage.setItem("latestReport", JSON.stringify(report));
}

// -------- Chart --------

window.onload = function(){

    const ctx = document.getElementById('drChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar'],
            datasets: [{
                label: 'DR Level Progress',
                data: [1, 2, 3],
                borderColor: '#4f7cff',
                backgroundColor: '#4f7cff',
                tension: 0.4
            }]
        },
        options: {
            scales: {
                y: {
                    min: 0,
                    max: 4
                }
            }
        }
    });

}
// Image Preview
document.addEventListener("DOMContentLoaded", function(){

    const chartCanvas = document.getElementById("drChart");

    if(chartCanvas){

        const ctx = chartCanvas.getContext("2d");

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar'],
                datasets: [{
                    label: 'DR Level Progress',
                    data: [1, 2, 3],
                    borderColor: '#4f7cff',
                    backgroundColor: 'rgba(79,124,255,0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        min: 0,
                        max: 4,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });

    }

});
// SEARCH FILTER
function filterDoctors(){
    let input = document.getElementById("searchDoctor").value.toLowerCase();
    let cards = document.getElementsByClassName("doctor-card");

    for(let i=0; i<cards.length; i++){
        let name = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
        if(name.includes(input)){
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

// MODAL FUNCTIONS
function openModal(name){
    document.getElementById("appointmentModal").style.display = "block";
    document.getElementById("doctorName").innerText = "Book Appointment with " + name;
}

function closeModal(){
    document.getElementById("appointmentModal").style.display = "none";
}

function confirmAppointment(){
    let date = document.getElementById("appointmentDate").value;
    let time = document.getElementById("appointmentTime").value;
    let doctor = document.getElementById("doctorName").innerText;

    if(date === ""){
        alert("Select date!");
        return;
    }

    let appointment = {
        doctor: doctor,
        date: date,
        time: time
    };

    localStorage.setItem("appointment", JSON.stringify(appointment));

    document.getElementById("confirmationMessage").innerText =
        "Appointment Confirmed on " + date + " at " + time + " 🎉";
}

function login(){
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    let role = document.getElementById("role").value;

    if(user === "" || pass === ""){
        document.getElementById("loginError").innerText = "Enter credentials!";
        return;
    }

    localStorage.setItem("loggedUser", user);
    localStorage.setItem("role", role);

    if(role === "patient"){
        window.location.href = "index.html";
    } else {
        window.location.href = "doctor.html";
    }
}

window.onload = function(){

    let report = JSON.parse(localStorage.getItem("latestReport"));

    if(report && document.getElementById("doctorReport")){
        document.getElementById("doctorReport").innerText =
            "Date: " + report.date +
            " | Level: " + report.level +
            " | Confidence: " + report.confidence;
    }

};

let selectedTime = "";

/* SEARCH */
function filterDoctors(){
    let input = document.getElementById("searchDoctor").value.toLowerCase();
    let cards = document.getElementsByClassName("doctor-card");

    for(let i=0; i<cards.length; i++){
        let name = cards[i].getElementsByTagName("h3")[0].innerText.toLowerCase();
        cards[i].style.display = name.includes(input) ? "" : "none";
    }
}

/* MODAL */
function openModal(name){
    document.getElementById("appointmentModal").style.display = "block";
    document.getElementById("doctorName").innerText =
        "Book Appointment with " + name;
}

function closeModal(){
    document.getElementById("appointmentModal").style.display = "none";
    document.getElementById("confirmationMessage").innerText = "";
}

/* SELECT TIME */
function selectTime(button){
    let buttons = document.getElementsByClassName("time-btn");

    for(let i=0; i<buttons.length; i++){
        buttons[i].classList.remove("active");
    }

    button.classList.add("active");
    selectedTime = button.innerText;
}

/* CONFIRM */
function confirmAppointment(){

    let date = document.getElementById("appointmentDate").value;

    if(date === "" || selectedTime === ""){
        alert("Please select date and time!");
        return;
    }

    document.getElementById("confirmationMessage").innerText =
        "Appointment Confirmed on " + date + " at " + selectedTime + " 🎉";
}

/* LOAD AI REPORT */
window.onload = function(){

    let report = JSON.parse(localStorage.getItem("latestReport"));

    if(report && document.getElementById("doctorReport")){
        document.getElementById("doctorReport").innerText =
            "Date: " + report.date +
            " | Level: " + report.level +
            " | Confidence: " + report.confidence;
    }
};