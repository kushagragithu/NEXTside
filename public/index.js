function openSubject(subject) {
  window.location.href = `/subjects/${subject}/topics`;
}

function openTest(subject) {
  window.location.href = `/mock/subject/${subject}`;
}

const skeletonHTML = document.querySelector(".subject-skeleton").outerHTML;
const container = document.querySelector(".subjects");

container.innerHTML = skeletonHTML.repeat(8);

async function fetchProfile() {
  try {
    const res = await fetch('https://nextside.onrender.com/user/profile', {
      credentials: 'include'
    });

    /*if (!res.ok) {
      throw new Error('Not authenticated');
    }*/

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Expected JSON, got HTML');
    }

    if (res.ok) {
      const data = await res.json();

      document.querySelector('.login').style.display = 'none';
      document.querySelector('.profile').style.display = 'flex';
      document.querySelector('.avatar').src = data.photo;
      window.currentUser = data;
    }
  } catch (err) {
      console.log("Not logged in");
      console.log(err);
  }
}

fetchProfile();

async function loadSubjects() {

  const res = await fetch("/subjects/data");

  let subjects = await res.json();

  subjects = subjects.map(sub => ({
      ...sub,
      attempted: getAttemptedCount(sub.name)
    }));

  subjects.sort((a, b) => b.attempted - a.attempted);

  container.innerHTML = "";

  subjects.forEach(subject => {
    const attempted = getAttemptedCount(subject.name);
    let counterText = "";

    if (subject.totalQuestions === 0) {
      counterText = "• Coming Soon";
      /*counterText = "• Unattempted"*/
    } else if (attempted === 0) {
      counterText = "• Unattempted";
    } else {
      counterText = `${attempted} / ${subject.totalQuestions}`;
    }

    let card = `<div class="subject">
          <div class="counter" >${counterText}</div>
          <div style="display: flex; align-items: center;">
            <h1 id="subject-name">${lookGood(subject.displayName)}</h1>
          </div>
          <p id="subject-pyq">Previous Years Questions and Solutions</p>
          <div class="btn-container">
            <button onclick="openSubject('${subject.name}')" class="btn btn-green">Topic Wise</button>
            <button onclick="openTest('${subject.name}')" class="btn btn-red">Mock Tests</button>
          </div>
        </div>`;
    container.innerHTML += card;
  });
}

loadSubjects();

function getAttemptedCount(subjectName) {
  return JSON.parse(localStorage.getItem("attempted_" + subjectName))?.length || 0;
}

function lookGood(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}