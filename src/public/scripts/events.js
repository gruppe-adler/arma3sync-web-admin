let eventsModel;
let missingMods = [];
let availableAddons = [];

displayEvents();

function displayEvents() {
    Promise
        .all([httpGet('/api/addons').then(res => res.json()), httpGet('/api/events').then(res => res.json())])
        .then((result) => {
            availableAddons = result[0].map(a => a.name);
            eventsModel = result[1];

            let eventContainer = document.getElementById('event-list');
            let thList = eventsModel.map(event => `<th title="${event.description}">${event.name}</th>`);
            let rows = availableAddons.map(mod => {
                let modCell = `<th scope="row">${mod}</th>`;
                let cells = eventsModel.map(event => {
                    let isActive = event.addonNames.indexOf(mod) !== -1;
                    let id = `checkbox_${event.name}_${mod}`;
                    return `
                    <td>
                        <input type="checkbox"
                            data-event="${event.name}"
                            data-addon="${mod}"
                            data-initial="${isActive}" ${isActive ? "checked" : ""}
                            id="${id}"
                        />
                        <label for="${id}"></label>
                    </td>`
                });
                return `<tr>${modCell} ${cells.join('')}</tr>`
            });

            eventContainer.innerHTML = `
                <table>
                    <thead>
                        <th></th>${thList.join()}                  
                    </thead>
                    <tbody>
                        ${rows.join('\n')}
                    </tbody>
                    <tfoot><th></th>${thList.join()}</tfoot>
                </table>
                `;
            eventContainer.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
                checkbox.addEventListener('change', checkboxListener);
            });

            handleMissingMods();
        });
}

function handleMissingMods() {
    missingMods = getMissingAddonsThatAreInEvents(eventsModel);
    if (missingMods.length > 0) {
        alert(`DANGER! these mods seem to not be available, but they are part of existing events: ${missingMods.join(', ')}`);
        document.getElementById('purge-missing-mods').style.display = 'block';
    } else {
        document.getElementById('purge-missing-mods').style.display = 'none';
    }
}

function getMissingAddonsThatAreInEvents(events) {
    const missingMods = [];
    events.forEach(event => event.addonNames.forEach(mod => {
        if ((availableAddons.indexOf(mod) === -1) && (missingMods.indexOf(mod) === -1)) {
            missingMods.push(mod);
        }
    }));
    return missingMods;
}

function checkboxListener() {
    const checked = this.checked;
    const eventModel = eventsModel.find(event => event.name === this.dataset.event);
    const addon = this.dataset.addon;
    const eventAddonIndex = eventModel.addonNames.indexOf(addon);
    if ((eventAddonIndex !== -1) && !checked) {
        switchAddonInEvent(eventModel, addon, false);
    }
    if ((eventAddonIndex === -1) && checked) {
        switchAddonInEvent(eventModel, addon, true);
    }
}

function switchAddonInEvent(eventModel, addonName, newState) {
    const eventAddonIndex = eventModel.addonNames.indexOf(addonName);
    if (newState) {
        eventModel.addonNames.push(addonName);
    } else {
        eventModel.addonNames.splice(eventAddonIndex, 1);
    }
}

document.querySelector('#save-event-list').addEventListener('click', submitEdit);
document.querySelector('#reload-event-list').addEventListener('click', () => {
    displayEvents();
    document.querySelector('#purge-missing-mods').style.background = 'none';
});
document.querySelector('#purge-missing-mods').addEventListener('click', () => {
    purgeMissingMods();
    document.querySelector('#purge-missing-mods').style.background = 'red';
});


function submitEdit() {
    document.getElementById('save-event-list').enabled = false;
    document.getElementById('reload-event-list').enabled = false;
    httpPut('/api/events', eventsModel).then(() => {
        document.getElementById('save-event-list').enabled = true;
        document.getElementById('reload-event-list').enabled = true;
        displayEvents();
    }, (err) => {
        console.log(err);
        alert('halp, something bad happened');
    });
}

function purgeMissingMods() {
    eventsModel.forEach(eventModel => {
        missingMods.forEach(missingMod => {
            switchAddonInEvent(eventModel, missingMod, false);
        });
    });
}

function httpGet(path) {
    return fetch(path, getOptions('GET'))
}

function httpPut(path, data) {
    return fetch(path, getOptions('PUT', data));
}

function getOptions(verb, data) {
    let options = {
        dataType: 'json',
        method: verb,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    return options;
}
