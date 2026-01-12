/*fetch("/user/profile/data")
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch your data!");
    return res.json();
  })
  .then(user => {
    document.getElementById("profile-photo").src = user.photo;
    document.getElementById("profile-name").textContent = user.name;
    document.getElementById("profile-email").textContent = user.email;
    document.getElementById("bookmarks").textContent = user.bookmarkedQuestions;
    document.getElementById("attempts").textContent = user.attemptedMocks;

    const joinedDate = new Date(user.joinedAt).toDateString();
    document.getElementById("joined").textContent = `Joined on ${joinedDate}`;
  })
  .catch(() => {
    openModal();
  });*/