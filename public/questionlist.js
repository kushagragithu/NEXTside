/*sidebar*/

const menuBtn = document.querySelector('.menu-btn');
const sidebar = document.querySelector('.sidebar');
const sidebarTopics = document.querySelector(".subject-topics");

menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
});

const pathParts = window.location.pathname.split("/");
const subject = pathParts[2];
const active = decodeURIComponent(pathParts[4]);

const previousWindow = document.querySelector('#previous-window')
previousWindow.addEventListener('click', () => {
    window.location.href = `/subjects/${subject}/topics`;
});

document.querySelector(".subject-header").innerText = subject.charAt(0).toUpperCase() + subject.slice(1);

fetch(`/subjects/${subject}/topics/data`)
  .then(res => res.json())
  .then(topics => {
    if (!topics.length) {
      container.innerHTML = `<p style="color: white;">No topics found for ${subject}.</p>
                             <img class="error-img" src="/assets/error-404.png">`;
      return;
    }

    const loader = document.querySelector(".loader");
    loader.style.display = "none";

    topics.forEach(topic => {

      const topicName = topic.name;
      const isActive = topicName.toLowerCase() === active.toLowerCase();

        sidebarTopics.innerHTML += `
            <a href="/subjects/${subject}/topics/${topic.name}/questions"
              class="subject-topic ${isActive ? 'active-topic' : ''}">${topic.name}</a>
        `;
    });
  })
  .catch(err => {
    console.error("Error fetching topics:", err);
    sidebarTopics.innerHTML = `<p style="color: white;">Failed to load topics.</p>`;
  });

/* Question list */

const questionList = document.querySelector(".questions")
const loaderQlist = document.querySelector(".loader-Qlist");

fetch(`/subjects/${subject}/topics/${pathParts[4]}/questions/data`)
  .then(res => res.json())
  .then(questions => {
    if (!questions.length) {
      questionList.innerHTML = `<div class="error-img">
                                  <img src="/assets/error-404.png">
                                  <p>No Questions found for ${decodeURIComponent(pathParts[4])}</p>
                                </div>`
      return;
    }

    loaderQlist.style.display = "none";

    const storageKey = "attempted_" + subject;
    const attemptedQuestions = JSON.parse(localStorage.getItem(storageKey)) || [];

    questions.forEach((question, i) => {
      const isAttempted = attemptedQuestions.includes(question._id);
        questionList.innerHTML += `
          <a href="/subjects/${subject}/topics/${pathParts[4]}/questions/${question._id}">
            <div class="question ${isAttempted ? 'attempted' : ''}">
                <div class="index">${i + 1}</div>
                <div class="question-line">${question.question}</div>
            </div>
          </a>
        `;
    });

    const startBtn = document.querySelector(".start-btn");

    startBtn.addEventListener("click", () => {
      window.location.href = `/subjects/${subject}/topics/${pathParts[4]}/questions/${questions[0]._id}`;
    });
  })
  .catch(err => {
    console.error("Error fetching topics:", err);
    questionList.innerHTML = `<p style="color: white;">Failed to load topics.</p>`;
  });