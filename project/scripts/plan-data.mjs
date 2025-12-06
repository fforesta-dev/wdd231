import { openScriptureModal } from "./modal.mjs";

const DATA_URL = "data/plan.json";

let planItems = [];

const fetchPlanData = async () => {
    if (planItems.length) return planItems;

    try {
        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error(`Network response was not ok (${response.status})`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid data format: expected an array");
        }

        planItems = data;
        return planItems;
    } catch (error) {
        console.error("Error fetching plan data:", error);
        const grid = document.querySelector("#plan-grid");
        if (grid) {
            grid.innerHTML =
                "<p class='small-note'>We’re sorry, the data could not be loaded right now. Please try again later.</p>";
        }
        return [];
    }
};

export const openRandomInsight = async () => {
    const items = await fetchPlanData();
    if (!items.length) return;

    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];
    openScriptureModal(randomItem);
};

const createPlanCardElement = (item) => {
    const card = document.createElement("article");
    card.className = "plan-card";

    card.innerHTML = `
    <p class="phase-label">${item.phaseLabel}</p>
    <h3>${item.title}</h3>
    <p>${item.summary}</p>
    <p class="scripture-ref">${item.scriptureRef}</p>
    <button type="button" class="button-secondary plan-more-btn" data-id="${item.id}">
      Scripture Insight
    </button>
  `;

    const button = card.querySelector(".plan-more-btn");
    button.addEventListener("click", () => {
        openScriptureModal(item);
    });

    return card;
};

export const initPlanGrid = async () => {
    const grid = document.querySelector("#plan-grid");
    const filterSelect = document.querySelector("#phase-filter");
    if (!grid || !filterSelect) return;

    const allItems = await fetchPlanData();
    if (!allItems.length) return;

    const render = (phaseFilter) => {
        grid.innerHTML = "";

        let filtered = allItems;

        if (phaseFilter && phaseFilter !== "all") {
            filtered = allItems.filter((item) => item.phase === phaseFilter);
        }

        filtered
            .slice()
            .sort((a, b) => a.order - b.order)
            .forEach((item) => {
                grid.appendChild(createPlanCardElement(item));
            });
    };

    render("all");

    filterSelect.addEventListener("change", (e) => {
        render(e.target.value);
    });
};

export const initPhaseLists = async () => {
    const allItems = await fetchPlanData();
    if (!allItems.length) return;

    const containers = {
        premortal: document.querySelector("#premortal-list"),
        mortal: document.querySelector("#mortal-list"),
        "spirit-world": document.querySelector("#spirit-world-list"),
        resurrection: document.querySelector("#resurrection-list"),
        kingdoms: document.querySelector("#kingdoms-list"),
    };

    Object.entries(containers).forEach(([phase, container]) => {
        if (!container) return;

        const itemsForPhase = allItems
            .filter((item) => item.phase === phase)
            .sort((a, b) => a.order - b.order);

        if (!itemsForPhase.length) {
            container.innerHTML = "<p class='small-note'>No items found.</p>";
            return;
        }

        itemsForPhase.forEach((item) => {
            container.appendChild(createPlanCardElement(item));
        });
    });
};
