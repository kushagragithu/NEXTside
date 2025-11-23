const menuBtn = document.querySelector('.menu-btn');
const sidebar = document.querySelector('.sidebar');
const mcqnos = document.querySelector('.mcq-nos');
const previousWindow = document.querySelector('#previous-window')

menuBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
});

const pathParts = window.location.pathname.split("/");
const subject = pathParts[2];
const topic = pathParts[4];
const active = pathParts[6];

previousWindow.addEventListener('click', () => {
    window.location.href = `/subjects/${subject}/topics/${topic}/questions`;
});

document.querySelector(".subject-header").innerText = decodeURI(topic).charAt(0).toUpperCase() + decodeURI(topic).slice(1);

let questionsList = [];

fetch(`/subjects/${subject}/topics/${topic}/questions/data`)
  .then(res => res.json())
  .then(questions => {
    if (!questions.length) {
      container.innerHTML = `<p style="color: white;">No questions found for ${decodeURI(topic)}.</p>`;
      return;
    }

    questionsList = questions;

    questions.forEach((questionIndex, i) => {

      const questionId = questionIndex._id;
      const isactive = questionId === active;

        mcqnos.innerHTML += `
            <a href="/subjects/${subject}/topics/${topic}/questions/${questionId}">
                <div class="mcq-no ${isactive ? 'active-no' : ''}">${i + 1}</div>
            </a>
        `;
    });
  });

function setupNavigation(attempt = 1) {
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.previous');

  if (!nextBtn || !prevBtn || !questionsList.length) {
    if (attempt < 10) { 
      console.warn(`⏳ Waiting for buttons or data... (Attempt ${attempt})`);
      setTimeout(() => setupNavigation(attempt + 1), 300);
    } else {
      console.error("❌ Navigation setup failed after multiple retries.");
    }
    return;
  }

  const normalizedActive = String(active).trim();
  const currentIndex = questionsList.findIndex(q => String(q._id).trim() === normalizedActive);
  
  const mcqIndexDiv = document.querySelector('.mcq-index');
  if (mcqIndexDiv && currentIndex !== -1) {
    mcqIndexDiv.textContent = currentIndex + 1;
  }

  console.log(currentIndex)

  if (currentIndex === -1) {
    console.error("❌ Could not match active ID with question list!");
    return;
  }

  if (currentIndex === 0) prevBtn.disabled = true;
  if (currentIndex === questionsList.length - 1) nextBtn.disabled = true;

  nextBtn.addEventListener('click', () => {
    if (currentIndex < questionsList.length - 1) {
      const nextId = questionsList[currentIndex + 1]._id;
      window.location.href = `/subjects/${subject}/topics/${topic}/questions/${nextId}`;
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      const prevId = questionsList[currentIndex - 1]._id;
      window.location.href = `/subjects/${subject}/topics/${topic}/questions/${prevId}`;
    }
  });
}

/* mcq js */

const questionDiv = document.querySelector('.main-mcq');
let timerInterval = null;

fetch(`/subjects/${subject}/topics/${topic}/questions/${active}/data`)
  .then(res => res.json())
  .then(questionData => {
    if (!questionData) {
      container.innerHTML = `<p style="color: white;">No questions found for ${decodeURI(topic)}.</p>`;
      return;
    }

    const { question , options, answer: correct, explanation} = questionData;
    const questionId = active;

    let questionHTML = `
                    <div class="mcq-question">
                      <div class="mcq-index"></div>
                      <div class="question-line">${question}</div>
                      <div class="timer"></div>
                    </div>
                    <div class="mcq-options">
                      ${options.map((opt, i) => `
                        <div class="mcq-option">
                          <div class="option-no">${i + 1}</div>
                          <div class="option" data-option="${opt}">${opt}</div>
                          <div class="mcq-state">Correct</div>
                        </div>
                      `).join('')}
                    </div>

                    <button class="submit-btn">Submit</button>

                    <div class="explanation">
                      <div style="color: var(--primary-color); margin-bottom: 0.5rem; height: fit-content; margin-left: 0 !important;" id="subject-header">Explanation</div>
                      <p class="explanation-line">${explanation}</p>
                    </div>

                    <div class="ai-explanation">
                      <a><img src="/assets/chatgpt-ai.png">ChatGPT</a>
                      <a><img src="/assets/gemini-ai.png">Gemini</a>
                    </div>

                    <div class="mcq-nav">
                      <button class="previous button">Previous</button>
                      <button class="submit button">Submit</button>
                      <button class="next button">Next</button>
                    </div>`

    questionDiv.innerHTML = questionHTML;

    setupNavigation();

    /* ai buttons */

    const chatGPTLink = document.querySelector('.ai-explanation a:nth-child(1)');
    const geminiLink = document.querySelector('.ai-explanation a:nth-child(2)');

    if (chatGPTLink && geminiLink) {
      const prompt = `Explain this question and its correct answer in detail:\nQuestion: ${question}\nAnswer: ${correct}`;
      const encodedPrompt = encodeURIComponent(prompt);

      chatGPTLink.addEventListener('click', () => {
        window.open(`https://chat.openai.com/?q=${encodedPrompt}`);
      });

      geminiLink.addEventListener('click', () => {
        window.open(`https://gemini.google.com/app?hl=en&q=${encodedPrompt}`, '_blank');
      });
    }

const submitBtns = document.querySelectorAll('.submit, .submit-btn');
const explanationDiv = document.querySelector('.explanation');
const timerDisplay = document.querySelector('.timer');
let selectedOption = null;
let isSubmitted = false;
let timeLeft = 60;

explanationDiv.style.display = "none";

const optionContainers = document.querySelectorAll('.mcq-option');

const attempted = JSON.parse(localStorage.getItem('attemptedQuestions')) || [];
let alreadyAttempted = attempted.includes(questionId);

if (alreadyAttempted) {
  explanationDiv.style.display = "block";
  optionContainers.forEach(o => {
    const optVal = o.querySelector('.option')?.dataset.option?.trim();
    if (optVal === correct.trim()){
      o.classList.add('correct');
      const state = o.querySelector('.mcq-state');
      state.style.display = "flex";
      state.innerText = "Correct";
    }
    o.querySelector('.option').style.pointerEvents = 'none';
  });

  submitBtns.forEach(btn => {
    btn.innerText = "⟳ Retry";
    btn.classList.remove('active');
    btn.disabled = false;
  });
} else {
  if (timerDisplay) startTimer();
}

submitBtns.forEach(btn => {
  btn.addEventListener('click', handleSubmitClick);
});

optionContainers.forEach(container => {
  container.addEventListener('click', () => {
    if (isSubmitted || alreadyAttempted) return;
    const optDiv = container.querySelector('.option');
    if (!optDiv) return;

    optionContainers.forEach(c => c.classList.remove('selected'));
    container.classList.add('selected');

    selectedOption = (optDiv.dataset.option || '').trim();
    submitBtns.forEach(btn => btn.classList.add('active'));
  });
});

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timeLeft = 60;
  timerDisplay.textContent = timeLeft;
  timerDisplay.style.color = "var(--text-color-white)";

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 10) timerDisplay.style.color = '#ff5555';
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      autoSubmit();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

function autoSubmit() {
  if (isSubmitted) return;
  handleSubmitClick(null, true);
}

function handleSubmitClick(e, isAuto = false) {
  const safeTrim = (val) => (typeof val === "string" ? val.trim() : "");

  optionContainers.forEach(o => {
    const state = o.querySelector('.mcq-state');
    state.style.display = 'none';
  });

  if (e && e.target && e.target.innerText === "⟳ Retry") {
    isSubmitted = false;
    alreadyAttempted = false;
    optionContainers.forEach(o => {
      o.classList.remove('selected', 'correct', 'wrong')
      const state = o.querySelector('.mcq-state');
      state.style.display = "none";
      state.innerText = "";
      const opt = o.querySelector('.option');
      opt.style.pointerEvents = "auto";
    });
    explanationDiv.style.display = "none";
    submitBtns.forEach(btn => {
      btn.innerText = "Submit";
      btn.classList.remove('active');
      btn.disabled = false;
    });
    selectedOption = null;
    timeLeft = 60;

    let attempted = JSON.parse(localStorage.getItem('attemptedQuestions')) || [];
    attempted = attempted.filter(id => id !== questionId);
    localStorage.setItem('attemptedQuestions', JSON.stringify(attempted));

    startTimer();
    return;
  }

  if (!selectedOption && !isAuto) return;

  stopTimer();
  isSubmitted = true;
  
  optionContainers.forEach(o => {
    const optVal = safeTrim(o.querySelector('.option')?.dataset.option);
    const state = o.querySelector('.mcq-state');
    if (optVal === safeTrim(correct)){ 
      o.classList.add('correct') 
      state.innerText = "Correct";
      state.style.display = "flex";
    } else if (o.classList.contains('selected')){ 
      o.classList.add('wrong')
      state.innerText = "Wrong";
      state.style.display = "flex";
    };
  });

  explanationDiv.style.display = "block";

  let attempted = JSON.parse(localStorage.getItem('attemptedQuestions')) || [];
  if (!attempted.includes(questionId)) {
    attempted.push(questionId);
    localStorage.setItem('attemptedQuestions', JSON.stringify(attempted));
  }

  submitBtns.forEach(btn => {
    btn.innerText = "⟳ Retry";
    btn.classList.add('active');
  });
}

  })
  .catch(err => {
    console.error("Error fetching question:", err);
    questionDiv.innerHTML = `<p style="color: white;">Failed to load Question.</p>`;
  });