let eventsModel = [];
let missingMods = [];
let availableAddons = [];

reload();

const identity = (x) => x;

function reload() {
    Promise
        .all([httpGet('/api/addons').then(res => res.json()), httpGet('/api/events').then(res => res.json())])
        .then((result) => {
            availableAddons = result[0].map(a => a.name);
            eventsModel = result[1];

            displayEvents();
        });
}

function displayEvents() {
    let eventContainer = document.getElementById('event-list');
    let thList = eventsModel.filter(identity).map((event, idx) => `
        <th title="${event.description}" data-event-index="${idx}">
            <span>${event.name}</span>
            <div class="event-controls">
            <button title="edit" name="edit_event" data-event-index="${idx}">e</button>
            <button title="delete" name="delete_event" data-event-index="${idx}">x</button>
            </div>
        </th>`);
    let rows = availableAddons.map(mod => {
        let modCell = `<th scope="row">${mod}</th>`;
        let cells = eventsModel.filter(identity).map((event, idx) => {
            let isActive = event.addonNames.indexOf(mod) !== -1;
            let id = `checkbox_${idx}_${mod}`;
            return `
                <td>
                    <input type="checkbox"
                        data-event-index="${idx}"
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
                    <th></th>${thList.join('')}
                </thead>
                <tbody>
                    ${rows.join('\n')}
                </tbody>
                <tfoot><th></th>${thList.join('')}</tfoot>
            </table>
            `;
    eventContainer.querySelectorAll('input[type=checkbox]').forEach(checkbox => {
        checkbox.addEventListener('change', checkboxListener);
    });
    eventContainer.querySelectorAll('button[name=delete_event]').forEach(button => {
        button.addEventListener('click', deleteButtonListener);
    });
    eventContainer.querySelectorAll('button[name=edit_event]').forEach(button => {
        button.addEventListener('click', editButtonListener);
    });

    handleMissingMods();
}

function handleMissingMods() {
    missingMods = getMissingAddonsThatAreInEvents(eventsModel.filter(identity));
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
    const eventModel = eventsModel[this.dataset.eventIndex];
    if (!eventModel) {
        throw new Error('wait wtf. couldnt find event ' + this.dataset.eventIndex);
    }
    const addon = this.dataset.addon;
    const eventAddonIndex = eventModel.addonNames.indexOf(addon);
    if ((eventAddonIndex !== -1) && !checked) {
        switchAddonInEvent(eventModel, addon, false);
    }
    if ((eventAddonIndex === -1) && checked) {
        switchAddonInEvent(eventModel, addon, true);
    }
}

function deleteButtonListener() {
    const index = this.dataset.eventIndex;
    eventsModel[index] = undefined;
    displayEvents();
}

function editButtonListener() {
    let index = this.dataset.eventIndex;
    let eventModel = eventsModel[index];

    let nameAndDesc = promptForNameAndDescription();
    eventModel.name = nameAndDesc.name;
    eventModel.description = nameAndDesc.description;

    displayEvents();
}

function promptForNameAndDescription() {
    let name = prompt('please enter event name:');
    if (!name) {
        alert('nah dude I insist on a name');
        throw new Error('user did not provide a name');
    }
    let description = prompt('please enter event description:') || '';

    return {
        name: name,
        description: description
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

document.querySelector('#new-event').addEventListener('click', newEvent);
document.querySelector('#save-event-list').addEventListener('click', submitEdit);
document.querySelector('#reload-event-list').addEventListener('click', () => {
    reload();
    document.querySelector('#purge-missing-mods').style.background = 'none';
});
document.querySelector('#purge-missing-mods').addEventListener('click', () => {
    purgeMissingMods();
    document.querySelector('#purge-missing-mods').style.background = 'red';
});

function newEvent() {
    let nameAndDescription = promptForNameAndDescription();
    eventsModel.push({
        name: nameAndDescription.name,
        description: nameAndDescription.description,
        addonNames: [],
    });
    displayEvents();
}

function submitEdit() {
    document.getElementById('save-event-list').enabled = false;
    document.getElementById('reload-event-list').enabled = false;
    httpPut('/api/events', eventsModel.filter(identity)).then(() => {
        document.getElementById('save-event-list').enabled = true;
        document.getElementById('reload-event-list').enabled = true;
        reload();
    }, (err) => {
        console.log(err);
        alert('halp, something bad happened');
    });
}

function purgeMissingMods() {
    eventsModel.filter(identity).forEach(eventModel => {
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
