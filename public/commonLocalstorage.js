const themeToggleBtn = document.getElementById("theme-toggle");
const icon = themeToggleBtn.querySelector("i");

const savedTheme = localStorage.getItem("theme") || "dark";
document.documentElement.setAttribute("data-theme", savedTheme);
icon.className = savedTheme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-moon";

themeToggleBtn.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  icon.className = newTheme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-moon";
});

function setDynamicTitle() {
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  let title = "";

  if (pathParts.length === 1 && pathParts[0] === "subjects") {
    title += "NEET PG | FMGE - Past 5 years Topic-Wise PYQ's | NEET PG | FMGE | INICET";
  } else if (pathParts.length >= 2 && pathParts[0] === "subjects") {
    const secondSegment = decodeURIComponent(pathParts[1]);

    if (pathParts.length === 2) {
      title += `NEET PG | FMGE - ${capitalize(secondSegment)} Past 5 years Topic-Wise PYQ's`;
    } else if (pathParts.includes("topics")) {
      const topicIndex = pathParts.indexOf("topics") + 1;
      if (topicIndex < pathParts.length) {
        const topicSegment = decodeURIComponent(pathParts[topicIndex]);
        title += `NEET PG | FMGE - ${topicSegment} Past 5 years Topic-Wise PYQ's`;
      } else {
        title += `NEET PG | FMGE - (${capitalize(secondSegment)}) Past 5 years Topic-Wise PYQ's`;
      }
    } else {
      title += ` - ${capitalize(secondSegment)} | NEET PG | FMGE | INICET | NTA Questions`;
    }
  }
  document.title = title;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

window.onload = setDynamicTitle;