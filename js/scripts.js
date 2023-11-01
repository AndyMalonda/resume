/**
 * Initializes the page on DOM content load.
 */
window.addEventListener("DOMContentLoaded", (event) => {
  activateBootstrapScrollspy();
  collapseResponsiveNavbar();
});

/**
 * Activates Bootstrap scrollspy on the main navigation element.
 */
function activateBootstrapScrollspy() {
  const sideNav = document.body.querySelector("#sideNav");
  if (sideNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: "#sideNav",
      offset: 74,
    });
  }
}

/**
 * Collapses the responsive navbar when a link is clicked.
 */
function collapseResponsiveNavbar() {
  const navbarToggler = document.body.querySelector(".navbar-toggler");
  const responsiveNavItems = Array.from(
    document.querySelectorAll("#navbarResponsive .nav-link")
  );
  responsiveNavItems.forEach(function (responsiveNavItem) {
    responsiveNavItem.addEventListener("click", () => {
      if (window.getComputedStyle(navbarToggler).display !== "none") {
        navbarToggler.click();
      }
    });
  });
}

/**
 * Opens a popup and hides it after 2.5 seconds.
 */
function popUpCopie() {
  const popup = document.getElementById("myPopup");
  popup.classList.toggle("show");

  function finPopUp() {
    popup.classList.toggle("hide");
  }
  setTimeout(finPopUp, 2500);
}

/**
 * Get the available date 3 months from the current date.
 * @returns {string} The formatted available date.
 */
function getAvailableDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const months = [
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre",
  ];

  const availableDate = new Date(year, month + 3, 1);
  const availableMonth = months[availableDate.getMonth()];
  const availableYear = availableDate.getFullYear();
  const preposition = /^[aeiouy]/i.test(availableMonth) ? "d'" : "de ";
  const availableDateStr = `${preposition}${availableMonth} ${availableYear}`;

  return availableDateStr;
}

const availableDateSelector = document.getElementById("available-date");
const availableDateStr = getAvailableDate();
availableDateSelector.innerText = availableDateStr;

const timelineContainer = document.getElementById("timeline-container");

/**
 * Generates HTML elements for the timeline dynamically.
 * @param {Array} timelineData - An array of timeline data.
 */
function generateTimeline(timelineData) {
  for (const entry of timelineData) {
    const timelineBlock = document.createElement("div");
    timelineBlock.classList.add(
      "timeline-block",
      timelineData.indexOf(entry) % 2 === 0
        ? "timeline-block-right"
        : "timeline-block-left"
    );

    const marker = document.createElement("div");
    marker.classList.add("marker");

    const timelineContent = document.createElement("div");
    timelineContent.classList.add("timeline-content", "shadow");

    const yearHeading = document.createElement("h3");
    yearHeading.textContent = entry.year;

    const textSpan = document.createElement("span");
    textSpan.textContent = entry.text;

    const subtextParagraph = document.createElement("p");
    subtextParagraph.textContent = entry.subtext;

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = entry.description;
    descriptionParagraph.style.display = "none";

    timelineContent.addEventListener("click", () => {
      descriptionParagraph.style.display =
        descriptionParagraph.style.display === "none" ? "block" : "none";
    });

    descriptionParagraph.style.transition = "display 0.5s ease-in-out";

    if (entry.description) timelineContent.style.cursor = "pointer";

    timelineContent.appendChild(yearHeading);
    timelineContent.appendChild(textSpan);
    timelineContent.appendChild(subtextParagraph);
    timelineContent.appendChild(descriptionParagraph);

    timelineBlock.appendChild(marker);
    timelineBlock.appendChild(timelineContent);

    timelineContainer.appendChild(timelineBlock);
  }
}

function displaySkills(competences) {
  const skillsContainer = document.getElementById("skills-container");

  const categories = [
    ...new Set(competences.map((competence) => competence.category)),
  ];

  categories.forEach((category) => {
    const categorySkills = competences.filter(
      (competence) => competence.category === category
    );

    const categoryRow = document.createElement("div");
    categoryRow.classList.add("row");

    const categoryTitle = document.createElement("div");
    categoryTitle.classList.add("subheading", "mb-3");
    categoryTitle.textContent = category;

    const skillsList = document.createElement("ul");
    skillsList.classList.add("list-inline", "dev-icons");

    categorySkills.forEach((competence) => {
      const skillItem = document.createElement("li");
      skillItem.classList.add("list-inline-item", "tooltipo", "mx-3");
      skillItem.innerHTML = `
          <i class="${competence.iconClass}"></i>
          <span class="tooltiptexto">${competence.name}</span>
        `;

      skillsList.appendChild(skillItem);
    });

    categoryRow.appendChild(categoryTitle);
    categoryRow.appendChild(skillsList);
    skillsContainer.appendChild(categoryRow);
  });
}

// Load data from a JSON file
fetch("data/data.json")
  .then((response) => response.json())
  .then((data) => {
    const experiences = data.experiences;
    const education = data.education;
    const timelineData = [...experiences, ...education];
    generateTimeline(timelineData);
  })
  .catch((error) => {
    console.error("An error occurred while loading the JSON file:", error);
  });

fetch("data/skills.json")
  .then((response) => response.json())
  .then((data) => {
    const competences = data;
    displaySkills(competences);
  })
  .catch((error) => {
    console.error("An error occurred while loading the JSON file:", error);
  });
