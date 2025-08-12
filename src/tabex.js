function Tabex(selector, options = {}) {
    this.container = document.querySelector(selector);
    if (!this.container) {
        console.error(`Tabex: No container found for selector '${selector}'`);
        return;
    }

    this.tabs = Array.from(this.container.querySelectorAll("li a"));
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

    this.opt = Object.assign(
        {
            remember: false,
        },
        options
    );

    this._originalHTML = this.container.innerHTML;

    this.paramsKey = selector.replace(/[^a-zA-Z0-9]/g, "");
    this._init();
}

Tabex.prototype._init = function () {
    const params = new URLSearchParams(location.search);
    const tabSelector = params.get(this.paramsKey);
    const tab =
        (this.opt.remember &&
            tabSelector &&
            this.tabs.find(
                (tab) =>
                    tab.getAttribute("href").replace(/[^a-zA-Z0-9]/g, "") ===
                    tabSelector
            )) ||
        this.tabs[0];

    this._activateTab(tab);

    this.tabs.forEach((tab) => {
        tab.onclick = (e) => this._handelTabClick(e, tab);
    });
};

Tabex.prototype._handelTabClick = function (e, tab) {
    e.preventDefault();

    this._activateTab(tab);
};

Tabex.prototype._activateTab = function (tab) {
    this.tabs.forEach((tab) => {
        tab.closest("li").classList.remove("tabex--active");
    });

    tab.closest("li").classList.add("tabex--active");

    this.panels.forEach((panel) => {
        panel.hidden = true;
    });

    const panelActive = document.querySelector(tab.getAttribute("href"));
    panelActive.hidden = false;

    if (this.opt.remember) {
        const params = new URLSearchParams(location.search);
        const paramsValue = tab
            .getAttribute("href")
            .replace(/[^a-zA-Z0-9]/g, "");
        params.set(this.paramsKey, paramsValue);
        history.replaceState(null, null, `?${params}`);
    }
};

Tabex.prototype.switch = function (input) {
    let tabToActivate = null;

    if (typeof input === "string") {
        tabToActivate = this.tabs.find(
            (tab) => tab.getAttribute("href") === input
        );

        if (!tabToActivate) {
            console.error(`Tabex: Not panel found with '${input}'`);
            return;
        }
    } else if (this.tabs.includes(input)) {
        tabToActivate = input;
    }

    if (!tabToActivate) {
        console.error(`Tabex: Invalid input '${input}'`);
        return;
    }

    this._activateTab(tabToActivate);
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
