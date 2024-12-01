export default function onElementAdded(selector, callback) {
    const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            obs.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}