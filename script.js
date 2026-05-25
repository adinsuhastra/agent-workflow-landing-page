const filterButtons = document.querySelectorAll(".filter-button");
const workflowCards = document.querySelectorAll(".workflow-card");
const reviewChecks = document.querySelectorAll(".review-check");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const copyButton = document.querySelector("#copyPrompt");
const copyStatus = document.querySelector("#copyStatus");
const workflowPrompt = document.querySelector("#workflowPrompt");

function setActiveFilter(selectedButton) {
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button === selectedButton);
  });
}

function filterCards(category) {
  workflowCards.forEach((card) => {
    const shouldShow = category === "all" || card.dataset.category === category;
    card.classList.toggle("is-hidden", !shouldShow);
  });
}

function updateProgress() {
  const total = reviewChecks.length;
  const checked = Array.from(reviewChecks).filter((input) => input.checked).length;
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);

  progressText.textContent = `${checked} / ${total}`;
  progressBar.style.width = `${percent}%`;
}

async function copyWorkflowPrompt() {
  const text = workflowPrompt.textContent.trim();

  try {
    if (!navigator.clipboard) {
      throw new Error("Clipboard API unavailable");
    }

    await navigator.clipboard.writeText(text);
    copyStatus.textContent = "Prompt copied.";
  } catch (error) {
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(workflowPrompt);
    selection.removeAllRanges();
    selection.addRange(range);

    copyStatus.textContent = "Prompt selected. Press Ctrl+C to copy.";
  }

  window.setTimeout(() => {
    copyStatus.textContent = "";
  }, 2500);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button);
    filterCards(button.dataset.filter);
  });
});

reviewChecks.forEach((input) => {
  input.addEventListener("change", updateProgress);
});

copyButton.addEventListener("click", copyWorkflowPrompt);

updateProgress();
