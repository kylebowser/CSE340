const year = document.querySelector("#current-year");

// use the date object
const today = new Date();

year.innerHTML = `<span class="highlight">${today.getFullYear()}</span>`;

document.getElementById("lastModified").innerHTML = `Last Modified: <span class="highlight">${document.lastModified}</span>`;