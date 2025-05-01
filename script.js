const sheetID = "YOUR_SHEET_ID";
const sheetName = "Sheet1";
const url = https://docs.google.com/spreadsheets/d/e/2PACX-1vSl2X5iANv--GC5dh3Q_4UzZoGfqe-SjcFfUFijPfejLWlknVRnqkyNyov2Oky5HApBtCNlTdIN3wXC/pub?output=csv;

let fullData = [];

fetch(url)
  .then(res => res.text())
  .then(rep => {
    const jsonData = JSON.parse(rep.substr(47).slice(0, -2));
    const rows = jsonData.table.rows;

    fullData = rows.map(row => ({
      name: row.c[0]?.v || "",
      roll: row.c[1]?.v || "",
      date: row.c[2]?.v || "",
      time: row.c[3]?.v || ""
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
    if (filterType === "name") return entry.name.toLowerCase().includes(filterValue);
    if (filterType === "roll") return entry.roll.toString().toLowerCase().includes(filterValue);
    if (filterType === "date") return entry.date.toLowerCase().includes(filterValue);
    return true;
  });

  renderTable(filtered);
}
