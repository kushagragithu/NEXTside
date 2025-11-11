const pathParts = window.location.pathname.split("/");
const subject = pathParts[2];

const previousWindow = document.querySelector('#previous-window')
previousWindow.addEventListener('click', () => {
    window.location.href = `/subjects`;
});

document.getElementById("pre-clinical").innerText = subject.charAt(0).toUpperCase() + subject.slice(1);

const container = document.querySelector(".topics");

// Fetch topics from backend
fetch(`/subjects/${subject}/topics/data`)
  .then(res => res.json())
  .then(topics => {
    if (!topics.length) {
      container.style.height = '100%';
      container.style.width = '100%';
      container.style.display = 'flex';
      container.innerHTML =   `<div class="error-img">
                                <img src="/assets/error-404.png">
                                <p>No topics found for ${subject}</p>
                              </div>`;
      return;
    }

    topics.forEach(topic => {
        const div = document.createElement("div");
        div.classList.add("topic");
        div.innerHTML = `
            <a href='/subjects/${subject}/topics/${topic.name}/questions'>
              <div class="topic-content">
                  <h2>${topic.name}</h2>
                  <span>Total Questions : ${topic.totalQuestions}</span>
              </div>
              <button onclick="openTopic('anatomy')" class="view-button">View Questions</button>
            </a>
            `;
        container.appendChild(div);

        div.querySelector(".view-button").addEventListener("click", () => {
            openTopic(subject, topic.name);
        });

    });
  })
  .catch(err => {
    console.error("Error fetching topics:", err);
    container.innerHTML = `<p class="text-center text-red-500">Failed to load topics.</p>
                           <img class="error-img" src="/assets/server.png">`;
  });

function openTopic(subject, topic) {
    window.location.href = `/subjects/${subject}/topics/${topic}/questions`;
}