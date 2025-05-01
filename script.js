const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vSl2X5iANv--GC5dh3Q_4UzZoGfqe-SjcFfUFijPfejLWlknVRnqkyNyov2Oky5HApBtCNlTdIN3wXC/pub?output=csv&timestamp=${new Date().getTime()}`;

let fullData = [];

fetch(url)
  .then(res => res.text())
  .then(csvData => {
    const rows = csvToArray(csvData).filter(row => row.length >= 4 && row.some(cell => cell.trim() !== ""));

    fullData = rows.map(row => ({
      name: row[0]?.trim() || "N/A",
      roll: row[1]?.trim() || "N/A",
      date: row[2]?.trim() || "N/A",
      time: row[3]?.trim() || "N/A"
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
  const filterType = filterOption.value.toLowerCase();
  const filterValue = filterInput.value.toLowerCase();

  if (filterType === "all" || filterValue === "") {
    renderTable(fullData);
    return;
  }

  const filtered = fullData.filter(entry => {
    if (filterType === "name") return entry.name.toLowerCase().includes(filterValue);
    if (filterType === "roll") return entry.roll.toLowerCase().includes(filterValue);
    if (filterType === "date") return entry.date.toLowerCase().includes(filterValue);
    return true;
  });

  renderTable(filtered);
}

// Basic CSV to array converter
function csvToArray(csv) {
  const rows = csv.trim().split("\n");
  return rows.map(row => row.split(","));
}
