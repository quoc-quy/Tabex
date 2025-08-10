function Tabex(selector) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(`Tabex: No container found for selector '${selector}'`);
        return;
    }

    this.tabs = Array.from(document.querySelectorAll("li a"));
    if (!this.tabs.length) {
        console.error("Tabex: No tabs found inside the container");
        return;
    }

    this.panels = this.tabs
        .map((tab) => {
            const panel = document.querySelector(tab.getAttribute("href"));
            if (!panel) {
                console.error(
                    `Tabex: No panel for selector '${tab.getAttribute("href")}'`
                );
                return;
            }
            return panel;
        })
        .filter(Boolean);
    if (this.tabs.length !== this.panels.length) return;

    this._init();
}

Tabex.prototype._init = function () {
    let tabActive = this.tabs[0];
    tabActive.closest("li").classList.add("tabex--active");

    this.panels.forEach((panel) => (panel.hidden = true));

    this.tabs.forEach((tab) => {
        tab.onclick = (e) => this._handelTabClick(e, tab);
    });

    const panelActive = this.panels[0];
    panelActive.hidden = false;
};

Tabex.prototype._handelTabClick = function (e, tab) {
    e.preventDefault();

    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabex--active");
    });

    tab.closest("li").classList.add("tabex--active");

    this.panels.forEach((panel) => {
        panel.hidden = true;
    });

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;
};
