// Get the modal element
var addRowModal = document.getElementById("add-row-modal");

// Get the button that opens the modal
var addRowBtn = document.getElementById("add-row-btn");

// Get the <span> element that closes the modal
var closeBtn = document.getElementsByClassName("close")[0];

// Get the form and input elements
var form = document.querySelector("#add-row-modal form");
var nameInput = document.querySelector("#name-input");
// var phoneInput = document.querySelector("#phone-input");
var lapTimeInput = document.querySelector("#lap-time-input");

// Get the submit and cancel buttons
var submitBtn = document.getElementById("submit-btn");
var cancelBtn = document.getElementById("cancel-btn");

// When the user clicks on the button, open the modal
addRowBtn.onclick = function() {
  addRowModal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
  addRowModal.style.display = "none";
};

// When the user clicks outside of the modal, close it
window.onclick = function(event) {
  if (event.target == addRowModal) {
    addRowModal.style.display = "none";
  }
};


// When the user submits the form, create a new row and hide the modal
submitBtn.addEventListener("click", function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the values from the input fields
  var name = nameInput.value;
  var lapTime = lapTimeInput.value;

  // Create a new table row and cells
  var newRow = document.createElement("tr");
  var nameCell = document.createElement("td");
  var lapTimeCell = document.createElement("td");

  // Add the input values to the cells
  nameCell.innerText = name;
  lapTimeCell.innerText = lapTime;

  // Add the cells to the new row
  newRow.appendChild(nameCell);
  newRow.appendChild(lapTimeCell);

  // Add the new row to the table
  var tableBody = document.querySelector("table tbody");
  tableBody.appendChild(newRow);

  // Clear the input fields
  nameInput.value = "";
  lapTimeInput.value = "";

  // Hide the modal
  addRowModal.style.display = "none";

  // Save the data to local storage
  var data = JSON.parse(localStorage.getItem("leaderboard")) || [];
  data.push({ name: name, lapTime: lapTime });
  localStorage.setItem("leaderboard", JSON.stringify(data));

  // Sort the table by lap time column
  sortTableByLapTime(1);
});


// Sort the table by lap time and name
function sortTableByLapTime() {
  var table = document.querySelector("table");
  var rows = Array.from(table.querySelectorAll("tr")).slice(1);
  var sortedRows = rows.sort(function(row1, row2) {
    var lapTime1 = parseInt(row1.querySelector("td:last-child").innerText.split(":").reduce((acc, time) => (60 * acc) + +time));
    var lapTime2 = parseInt(row2.querySelector("td:last-child").innerText.split(":").reduce((acc, time) => (60 * acc) + +time));
    if (lapTime1 === lapTime2) {
      var name1 = row1.querySelector("td:first-child").innerText;
      var name2 = row2.querySelector("td:first-child").innerText;
      return name1.localeCompare(name2);
    }
    return lapTime1 - lapTime2;
  });
  sortedRows.forEach(function(row) {
    table.querySelector("tbody").appendChild(row);
  });

  const lapTimeCells = table.querySelectorAll("tbody td:last-child");

  // Check if lap time cells were found
  if (lapTimeCells.length === 0) {
    console.log("No lap time cells found");
    return;
  }

  // Convert lap times to seconds
  const lapTimesInSeconds = [...lapTimeCells].map(cell => {
    const timeParts = cell.textContent.split(":");
    const minutes = parseInt(timeParts[0]);
    const seconds = parseInt(timeParts[1]);
    return (minutes * 60) + seconds;
  });

  // Sort lap times in ascending order
  const sortedLapTimesInSeconds = lapTimesInSeconds.slice().sort((a, b) => a - b);

  // Handle tie cases
  const lapTimeCounts = {};
  lapTimesInSeconds.forEach(lapTime => {
    lapTimeCounts[lapTime] = (lapTimeCounts[lapTime] || 0) + 1;
  });

}

// Call the sortTableByLapTime function to sort the table on page load
sortTableByLapTime();


// Load the data from local storage when the page is loaded
window.onload = function() {
  var data = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Create a new table row for each item in the data array
  data.forEach(function(item) {
    var newRow = document.createElement("tr");
    var nameCell = document.createElement("td");
    // var phoneCell = document.createElement("td");
    var lapTimeCell = document.createElement("td");

    nameCell.innerText = item.name;
    // phoneCell.innerText = item.phone;
    lapTimeCell
    lapTimeCell.innerText = item.lapTime;
    newRow.appendChild(nameCell);
    // newRow.appendChild(phoneCell);
    newRow.appendChild(lapTimeCell);
    var tableBody = document.querySelector("table tbody");
    tableBody.appendChild(newRow);
  });
    // Sort the table by lap time
    sortTableByLapTime(1);
};


// Add an event listener to the form to save the data to local storage
form.addEventListener("submit", function(event) {
  event.preventDefault();

  var name = nameInput.value;
  // var phone = phoneInput.value;
  var lapTime = lapTimeInput.value;

  // Create a new object to represent the row data
  var row = { name: name, lapTime: lapTime };

  // Add the new row object to the data array
  data.push(row);

  // Save the data to local storage
  localStorage.setItem("leaderboard", JSON.stringify(data));

  // Create a new table row for the new data and add it to the table
  var newRow = document.createElement("tr");
  var nameCell = document.createElement("td");
  // var phoneCell = document.createElement("td");
  var lapTimeCell = document.createElement("td");

  nameCell.innerText = name;
  // phoneCell.innerText = phone;
  lapTimeCell.innerText = lapTime;
  newRow.appendChild(nameCell);
  // newRow.appendChild(phoneCell);
  newRow.appendChild(lapTimeCell);
  var tableBody = document.querySelector("table tbody");
  tableBody.appendChild(newRow);

  // Sort the table by lap time
  sortTableByLapTime();
});


// EXPORT TO EXCEL BUTTON //

const exportBtn = document.getElementById("export-btn");
exportBtn.addEventListener("click", exportData);

function exportData() {
  console.log("Export button clicked!");
  // Get the data from local storage
  const data = JSON.parse(localStorage.getItem("leaderboard")) || [];

  // Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leaderboard");

  // Save the workbook as a file
  const date = new Date().toISOString().slice(0, 10);
  const filename = `Leaderboard-${date}.xlsx`;
  XLSX.writeFile(workbook, filename);
}



// RESETTING THE TABLE ====================== //

// select the table body element
const tableBody = document.querySelector('tbody');

// function to reset the table
function resetTable() {
  // remove all rows from the table body
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
}

// add an event listener to the reset button
const resetBtn = document.querySelector('#reset-btn');
resetBtn.addEventListener('click', resetTable);


function resetTable() {
  // Reset the table body
  const tbody = document.querySelector('tbody');
  tbody.innerHTML = '';

  // Update the leaderboard array and save it in localStorage
  leaderboard = [];
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

let leaderboard = [];

// Check if there's a saved leaderboard in localStorage
const storedLeaderboard = localStorage.getItem('leaderboard');
if (storedLeaderboard) {
  leaderboard = JSON.parse(storedLeaderboard);
}
