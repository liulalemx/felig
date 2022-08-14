// import felig_toolkit from "felig-toolkit";

// Selectors
const fileInput = document.querySelector(".custom-file-input");
const queryInput = document.querySelector(".searchBar");
const resultList = document.querySelector(".search-list");

// Event Listeners
if (fileInput) {
  fileInput.addEventListener("change", logListofFiles);
}

queryInput.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    // Enter key was hit
    console.log("1.input:" + queryInput.value);

    // console.log("here");
    const msg = await window.electronAPI.say_hello(queryInput.value);

    console.log("4.render:" + msg);
  }
});

// Functions
async function logListofFiles() {
  const curFiles = fileInput.files;
  const arrFiles = [];

  for (const file of curFiles) {
    arrFiles.push(file.path);
  }

  const res = await window.electronAPI.sim_check(arrFiles);

  //process
  res.forEach((file) => {
    var lastPart = file[0].replace(/\\$/, "").split("\\").pop();
    let li = document.createElement("li");
    li.classList.add("searchResult");
    li.innerHTML = `<div class="fileDisplay"><h3>${lastPart}</h3><p>${file[0]}</p></div><h4>${file[1]}%</h4>`;
    resultList.appendChild(li);
  });

  console.log(Object.keys(res));
}
