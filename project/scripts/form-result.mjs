import { saveReflection } from "./storage.mjs";

const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
        name: params.get("name") || "",
        phase: params.get("phase") || "",
        message: params.get("message") || "",
    };
};

const formatPhaseLabel = (phase) => {
    switch (phase) {
        case "premortal":
            return "Premortal Life";
        case "mortal":
            return "Earth Life";
        case "spirit-world":
            return "Spirit World";
        case "resurrection":
            return "Resurrection & Judgment";
        case "kingdoms":
            return "Kingdoms of Glory";
        default:
            return phase || "Not specified";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const { name, phase, message } = getQueryParams();

    const nameElem = document.querySelector("#result-name");
    const phaseElem = document.querySelector("#result-phase");
    const messageElem = document.querySelector("#result-message");
    const yearSpan = document.querySelector("#year");

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    if (nameElem) {
        nameElem.textContent = name || "Anonymous";
    }
    if (phaseElem) {
        phaseElem.textContent = formatPhaseLabel(phase);
    }
    if (messageElem) {
        messageElem.textContent = message || "(No reflection was provided.)";
    }

    if (message.trim()) {
        saveReflection({
            name: name.trim(),
            phase,
            message: message.trim(),
            submittedAt: new Date().toISOString(),
        });
    }
});
