const checkIcon = document.querySelectorAll(".fa-check");

Array.from(checkIcon).forEach((element) => {
  element.addEventListener("click", markCompleted);
});

async function markCompleted() {
  const texiId = this.parentNode.dataset.id;
  try {
    const response = await fetch("/markComplete", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texiIdFromJSFile: texiId,
      }),
    });
    const data = await response.json();
    console.log(data);
    location.reload();
  } catch (err) {
    console.log(err);
  }
}
