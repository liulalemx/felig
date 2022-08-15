// Selectors
const fileInput = document.querySelector(".custom-file-input");
const queryInput = document.querySelector(".searchBar");
const resultList = document.querySelector(".search-list");
const header = document.querySelector(".main-header");
const dropdown = document.getElementById("dropdown");

// Recent history dropdown
dropdown.addEventListener("click", toggle);

const dropdownLabel = document.querySelector(".dropdown-label");
dropdownLabel.addEventListener("click", fetchHist);

const pp = document.createElement("div");
function fetchHist() {
  let history = JSON.parse(localStorage.getItem("history"));

  if (history) {
    pp.innerHTML = "";
    history.forEach((entry) => {
      const p = document.createElement("p");
      p.innerText = entry;
      pp.appendChild(p);
    });
  }
}

function toggle() {
  // Expand items
  dropdown.contains(pp) ? pp.remove() : dropdown.appendChild(pp);
}

// Event Listeners
queryInput.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    // Enter key was hit
    if (queryInput.value && fileInput.files.length) {
      // Update History
      let history = JSON.parse(localStorage.getItem("history"));
      if (history) {
        if (history.length >= 5) history.shift();
        history.push(queryInput.value);
        localStorage.setItem("history", JSON.stringify(history));
      } else {
        let history = [];
        history.push(queryInput.value);
        localStorage.setItem("history", JSON.stringify(history));
      }

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
        li.innerHTML = `<div class="fileDisplay"><h3>${lastPart}</h3><p>${file[0]}</p></div><span class="counter" data-target=${file[1]}>0</span>%`;
        resultList.appendChild(li);
      });

      const counters = document.querySelectorAll(".counter");

      function countUp() {
        counters.forEach((counter) => {
          counter.innerText = "0";

          const updateCounter = () => {
            // Get count target
            const target = +counter.getAttribute("data-target");
            // Get current counter value
            const c = +counter.innerText;

            // Create an increment
            const increment = target / 100;

            // If counter is less than target, add increment
            if (c < target) {
              // Round up and set counter value
              counter.innerText = `${Math.ceil(c + increment)}`;

              setTimeout(updateCounter, 35);
            } else {
              counter.innerText = target;
            }
          };

          updateCounter();
        });
      }
      countUp();
      // console.log(Object.keys(res));
    } else {
      let msgBx = document.createElement("div");
      msgBx.classList.add("alert");
      msgBx.innerHTML = `<strong>Sorry!</strong> Please select files to search.`;
      header.appendChild(msgBx);
      setTimeout(function () {
        header.removeChild(msgBx);
      }, 3000);
    }
  }
});
