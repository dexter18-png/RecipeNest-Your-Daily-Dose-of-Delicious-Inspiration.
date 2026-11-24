/*
 * RecipeNest — gentle scroll reveal
 * Uses IntersectionObserver, with a safe fallback for older browsers.
 */
(function () {
    "use strict";
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var selector = [
        "main section", ".recipe-card", ".service-grid article",
        ".benefit-card", ".meal-slot", ".nutrition-card",
        ".profile-card", ".feature-card"
    ].join(",");

    if (!("IntersectionObserver" in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("rn-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    function reveal(root) {
        if (!root || !root.querySelectorAll) return;
        var nodes = [];
        if (root.matches && root.matches(selector)) nodes.push(root);
        nodes = nodes.concat(Array.prototype.slice.call(root.querySelectorAll(selector)));
        nodes.forEach(function (node) {
            if (node.classList.contains("rn-reveal")) return;
            node.classList.add("rn-reveal");
            observer.observe(node);
        });
    }

    function start() {
        reveal(document);
        var mutationObserver = new MutationObserver(function (records) {
            records.forEach(function (record) {
                record.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) reveal(node);
                });
            });
        });
        mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
    } else {
        start();
    }
})();
