const root = document.querySelector("root");
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.className = "form-control mb-3";
fileInput.addEventListener("change", function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const fileContent = e.target.result;
      const rows = fileContent.trim().split("\n");
      createTable(rows);
    };
    reader.readAsText(file);
  }
});

const saveButton = document.createElement("button");
saveButton.id = "save-btn";
saveButton.className = "btn btn-success mb-3";
saveButton.textContent = "Save";

saveButton.addEventListener("click", function saveDataToServer() {
  const table = document.querySelector("table");
  if (!table) return;

  const data = [];
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    const person = new Person(
      cells[0].textContent,
      cells[1].textContent,
      cells[2].textContent,
      cells[3].textContent,
      cells[4].textContent
    );
    data.push(person);
  });

  fetch("http://localhost:3000/persons", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        alert("Data yuklendi");
      }
    })
    .catch((error) => {
      console.error("Err:", error);
      alert("Errr");
    });
});

const tableContainer = document.createElement("div");
tableContainer.id = "table-container";

root.appendChild(fileInput);
root.appendChild(saveButton);
root.appendChild(tableContainer);

// table

function createTable(rows) {
  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.className = "table table-striped table-bordered table-hover";

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  const headers = ["First Name", "Last Name", "Email", "Phone", "Occupation"];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  rows.forEach((row) => {
    const columns = row.split(",");
    if (columns.length !== headers.length) {
      alert("Xeta, dogru file yukleyin!");
      return;
    }

    const tableRow = document.createElement("tr");
    const person = new Person(
      columns[0],
      columns[1],
      columns[2],
      columns[3],
      columns[4]
    );

    Object.values(person).forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tableRow.appendChild(td);
    });

    tbody.appendChild(tableRow);
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);

  if (tbody.children.length > 0) {
    saveButton.style.display = "block";
  }
}

class Person {
  constructor(firstName, lastName, email, phone, occupation) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.occupation = occupation;
  }
}
