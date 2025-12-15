export const initHandlers = () => {
  document.addEventListener("click", (event) => {
    if (event.target.matches(".copyBtn")) copyLink(event);
  });
};

const copyLink = (event) => {
  const button = event.target;
  const link = button.previousElementSibling;

  navigator.clipboard.writeText(link.href).then(() => {
    const originalText = button.textContent;

    button.textContent = "Copied!";
    button.classList.add("text-green-600");

    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("text-green-600");
    }, 10000);
  });
};
