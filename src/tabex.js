function Tabis(tabId, options = {}) {
    const tabs = document.querySelector(`#${tabId}`);

    const items = document.querySelectorAll(`#${tabId} a`);

    let itemActive = items[0];
    let tabActive = document.querySelector(".appear");

    items.forEach((item) => {
        item.onclick = () => {
            if (!item.classList.contains("active")) {
                item.classList.add("active");

                itemActive.classList.remove("active");
                itemActive = item;
            }
            const itemLink = item.getAttribute("href");
            tabActive.classList.remove("appear");

            const tab = document.querySelector(itemLink);
            tab.classList.add("appear");
            tabActive = tab;
        };
    });
}

const tab = new Tabis("tabs");
