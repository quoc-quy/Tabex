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

    this._originalHTML = this.container.innerHTML;

    this._init();
}

Tabex.prototype._init = function () {
    this._activeTab(this.tabs[0]);

    this.tabs.forEach((tab) => {
        tab.onclick = (e) => this._handelTabClick(e, tab);
    });
};

Tabex.prototype._handelTabClick = function (e, tab) {
    e.preventDefault();

    this._activeTab(tab);
};

Tabex.prototype._activeTab = function (tab) {
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

Tabex.prototype.switch = function (input) {
    let tabToActive = null;

    if (typeof input === "string") {
        tabToActive = this.tabs.find(
            (tab) => tab.getAttribute("href") === input
        );

        if (!tabToActive) {
            console.error(`Tabex: Not panel found with '${input}'`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActive = input;
    }

    if (!tabToActive) {
        console.error(`Tabex: Invalid input '${input}'`);
        return;
    }

    this._activeTab(tabToActive);
};

Tabex.prototype.destroy = function () {
    this.container.innerHTML = this._originalHTML;
    this.panels.forEach((panel) => {
        panel.hidden = false;
    });

    this.container = null;
    this.tabs = null;
    this.panels = null;
};
