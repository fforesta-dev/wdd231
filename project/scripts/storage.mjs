const VISIT_KEY = "eternal-journey-last-visit";
const REFLECTION_KEY = "eternal-journey-reflection";

export const initVisitMessage = () => {
    const elem = document.querySelector("#visit-message");
    if (!elem) return;

    const now = new Date();
    const lastVisit = localStorage.getItem(VISIT_KEY);

    if (!lastVisit) {
        elem.textContent =
            "Welcome! This may be your first visit. We hope this overview helps you feel closer to Heavenly Father and Jesus Christ.";
    } else {
        const diffMs = now - new Date(lastVisit);
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        const when =
            diffDays <= 0
                ? "earlier today"
                : diffDays === 1
                    ? "yesterday"
                    : `${diffDays} days ago`;

        elem.textContent = `Welcome back! You last visited this page ${when}. What new insight will you find today?`;
    }

    localStorage.setItem(VISIT_KEY, now.toISOString());
};

export const saveReflection = (reflectionObj) => {
    try {
        localStorage.setItem(REFLECTION_KEY, JSON.stringify(reflectionObj));
    } catch (error) {
        console.warn("Could not save reflection to localStorage:", error);
    }
};

export const loadSavedReflection = () => {
    const output = document.querySelector("#saved-reflection");
    if (!output) return;

    const raw = localStorage.getItem(REFLECTION_KEY);
    if (!raw) {
        output.textContent =
            "No reflection saved yet. When you share a reflection on the Home page, a brief summary will appear here.";
        return;
    }

    try {
        const data = JSON.parse(raw);
        const { name, phase, message } = data;

        const nameText = name ? `${name}` : "A visitor";
        const phaseText = phase ? phase.replace("-", " ") : "one part of the Plan";

        output.textContent = `${nameText} wrote about ${phaseText}: “${message}”`;
    } catch (error) {
        console.error("Error reading reflection from localStorage:", error);
        output.textContent =
            "We had trouble loading your saved reflection. You may want to submit a new one on the Home page.";
    }
};
