const modal = document.querySelector("#scripture-modal");
const modalContent = modal ? modal.querySelector("#modal-content") : null;
const modalTitle = modal ? modal.querySelector("#modal-title") : null;

export const initModal = () => {
    if (!modal) return;

    modal.addEventListener("cancel", (event) => {
        event.preventDefault();
        modal.close();
    });
};

export const openScriptureModal = (item) => {
    if (!modal || !modalContent || !modalTitle) return;

    modalTitle.textContent = item.title;

    modalContent.innerHTML = `
    <p><strong>Phase:</strong> ${item.phaseLabel}</p>
    <p><strong>Scripture:</strong> ${item.scriptureRef}</p>
    <p>${item.scriptureText}</p>
    <p><strong>Reflection:</strong> ${item.insight}</p>
  `;

    if (typeof modal.showModal === "function") {
        modal.showModal();
    } else {
        modal.setAttribute("open", "open");
    }
};
