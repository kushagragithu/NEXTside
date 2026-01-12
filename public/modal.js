function openSubject(subject) {
    window.location.href = `/subjects/${subject}/topics`;
}

async function openTest(subject) {
  const res = await fetch(`/mock/subject/${subject}`, {
    headers: { "Accept": "application/json" }
  });

  if (res.status === 401) {
    openModal();
    return;
  }

  window.location.href = `/mock/subject/${subject}`;
}

async function openDashboard(){
  const res = await fetch ('/user/dashboard' , {
    headers : { "Accept": "application/json"}
  });

  if(res.status === 401){
    openModal();
    return;
  }

  window.location.href = `/user/dashboard`;
}

/* utilities */

function openModal() {
  document.getElementById("authModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("authModal").style.display = "none";
}

function login() {
  window.location.href = "/auth/google";
}

document.getElementById("authModal").addEventListener("click", e => {
  if (e.target.id === "authModal") closeModal();
});