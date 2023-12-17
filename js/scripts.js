//#region generic DOM manipulation functions
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
    // eslint-disable-next-line no-new, no-undef
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
//#endregion

//#region date related functions
/**
 * Get the available date 3 months from the current date.
 * @returns {string} The formatted available date.
 */
function getAvailableDate() {
  const today = new Date();
  const availableDate = new Date(today.getFullYear(), today.getMonth() + 3, 1);

  const options = { month: "long", year: "numeric" };
  const availableDateStr = availableDate.toLocaleDateString("fr-FR", options);

  return `${preposition}${availableMonth} ${availableDate.getFullYear()}`;
}

const availableDateSelector = document.getElementById("available-date");
const availableDateStr = getAvailableDate();
availableDateSelector.innerText = availableDateStr;

const timelineContainer = document.getElementById("timeline-container");

function datesToDuration(startDate = null, endDate = null) {
  const currentDate = new Date();

  const getDurationInMonths = (start, end) => {
    const startObj = new Date(start);
    const endObj = end ? new Date(end) : currentDate;
    return (
      (endObj.getFullYear() - startObj.getFullYear()) * 12 +
      (endObj.getMonth() - startObj.getMonth())
    );
  };

  const durationInMonths = startDate
    ? getDurationInMonths(startDate, endDate)
    : null;

  if (startDate && endDate) {
    return durationToString(durationInMonths);
  } else if (startDate && !endDate) {
    return durationToString(durationInMonths);
  } else if (!startDate && endDate) {
    return endDate.split("-")[0]; // Extract year from endDate
  } else {
    return "";
  }
}

function durationToString(durationInMonths) {
  const years = Math.floor(durationInMonths / 12);
  const months = durationInMonths % 12;

  const yearStr = years > 0 ? `${years} an${years > 1 ? "s" : ""}` : "";
  const monthStr = months > 0 ? `${months} mois` : "";

  return `${yearStr}${years > 0 && months > 0 ? " et " : ""}${monthStr}`;
}

function dateToString(date, precision = 6) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const dateStr = date.toLocaleDateString("fr-FR", options);

  return dateStr
    .split(" ")
    .slice(0, precision)
    .filter((str) => str !== "")
    .join(" ");
}

function datesToString(startDate = null, endDate = null) {
  // determine precision based on date length
  // ex 2023 is year, 2023-05 is month, 2023-05-01 is day
  const precision = startDate ? startDate.length : endDate.length;

  if (startDate) {
    const startDateObj = new Date(startDate);
    const endDateObj = endDate ? new Date(endDate) : null;

    const startDateStr = dateToString(startDateObj, precision);
    const endDateStr = endDate
      ? dateToString(endDateObj, precision)
      : "présent";

    return endDate
      ? `${startDateStr} - ${endDateStr}`
      : `depuis ${startDateStr}`;
  } else if (endDate) {
    const endDateObj = new Date(endDate);
    return dateToString(endDateObj, precision);
  } else {
    return "";
  }
}
//#endregion

//#region timeline
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

    const datesHeading = document.createElement("h3");
    // prevents dates from being displayed in reverse order in the timeline
    datesHeading.dir = "ltr";

    const dateRange = datesToString(entry.startDate, entry.endDate);
    const durationStr = datesToDuration(entry.startDate, entry.endDate);

    // only dispay date range for education entries
    if (entry.type === "education") {
      datesHeading.textContent = dateRange;
    } else {
      datesHeading.textContent = `${dateRange} (${durationStr})`;
    }

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

    timelineContent.appendChild(datesHeading);
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
//#endregion

//#region data fetching

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
//#endregion
