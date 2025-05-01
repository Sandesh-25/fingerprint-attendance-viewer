const sheetID = "1QZ88osDtOv5kzd4E_U1YrVAJwF-ReTIw305AGr5LoGo";
const sheetName = "Sheet1";
const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSl2X5iANv--GC5dh3Q_4UzZoGfqe-SjcFfUFijPfejLWlknVRnqkyNyov2Oky5HApBtCNlTdIN3wXC/pub?output=csv`;

let fullData = [];

fetch(url)
  .then(res => res.text())
  .then(csvData => {
    const rows = csvToArray(csvData);
    
    fullData = rows.map(row => ({
      Name: row[0] || "",
      Roll: row[1] || "",
      Date: row[2] || "",
      Time: row[3] || ""
    }));

    renderTable(fullData);
  });

function renderTable(data) {
  const tableBody = document.querySelector("#dataTable tbody");
  tableBody.innerHTML = "";
  data.forEach(entry => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${entry.name}</td><td>${entry.roll}</td><td>${entry.date}</td><td>${entry.time}</td>`;
    tableBody.appendChild(tr);
  });
}

const filterInput = document.getElementById("filterInput");
const filterOption = document.getElementById("filterOption");

filterInput.addEventListener("input", () => applyFilter());
filterOption.addEventListener("change", () => {
  filterInput.value = "";
  applyFilter();
});

function applyFilter() {
  const filterType = filterOption.value;
  const filterValue = filterInput.value.toLowerCase();

  if (filterType === "all" || filterValue === "") {
    renderTable(fullData);
    return;
  }

  const filtered = fullData.filter(entry => {
    if (filterType === "Name") return entry.name.toLowerCase().includes(filterValue);
    if (filterType === "Roll") return entry.roll.toString().toLowerCase().includes(filterValue);
    if (filterType === "Date") return entry.date.toLowerCase().includes(filterValue);
    return true;
  });

  renderTable(filtered);
}

// Helper function to convert CSV data into an array of rows
function csvToArray(csv) {
  const rows = csv.split("\n");
  return rows.map(row => row.split(","));
}

