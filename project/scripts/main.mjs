import { initPlanGrid, initPhaseLists, openRandomInsight } from "./plan-data.mjs";
import { initModal } from "./modal.mjs";
import { initVisitMessage, loadSavedReflection } from "./storage.mjs";

const initRandomInsightButton = () => {
    const button = document.querySelector("#random-insight-btn");
    if (!button) return;

    button.addEventListener("click", () => {
        openRandomInsight();
    });
};

const navToggle = () => {
    const menuButton = document.querySelector("#menu-toggle");
    const nav = document.querySelector(".site-nav");

    if (!menuButton || !nav) return;

    menuButton.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        menuButton.setAttribute("aria-expanded", String(isOpen));
    });
};

const initYear = () => {
    const yearSpan = document.querySelector("#year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    navToggle();
    initYear();
    initModal();
    initVisitMessage();
    initRandomInsightButton();

    const planGrid = document.querySelector("#plan-grid");
    if (planGrid) {
        initPlanGrid();
    }

    const phaseListsExist =
        document.querySelector("#premortal-list") ||
        document.querySelector("#mortal-list") ||
        document.querySelector("#spirit-world-list") ||
        document.querySelector("#resurrection-list") ||
        document.querySelector("#kingdoms-list");

    if (phaseListsExist) {
        initPhaseLists();
    }

    const savedReflection = document.querySelector("#saved-reflection");
    if (savedReflection) {
        loadSavedReflection();
    }
});
