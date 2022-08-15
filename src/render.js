// Selectors
const fileInput = document.querySelector(".custom-file-input");
const queryInput = document.querySelector(".searchBar");
const resultList = document.querySelector(".search-list");
const header = document.querySelector(".main-header");

// Event Listeners
queryInput.addEventListener("keydown", async function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    // Enter key was hit
    if (queryInput.value && fileInput.files.length) {
      console.log(queryInput.value);
      console.log(fileInput.files.length);
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
