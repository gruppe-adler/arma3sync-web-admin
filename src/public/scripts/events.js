let eventsModel;

displayEvents();

function displayEvents() {
    Promise
        .all([httpGet('/api/addons').then(res => res.json()), httpGet('/api/events').then(res => res.json())])
        .then((result) => {
            let addons = result[0];
            let events = result[1];

            eventsModel = events;

            let eventContainer = document.getElementById('event-list');
            let thList = events.map(event => `<th title="${event.description}">${event.name}</th>`);
            let modList = addons.map(a => a.name);
            let rows = modList.map(mod => {
                let modCell = `<th scope="row">${mod}</th>`;
                let cells = events.map(event => {
                    let isActive = event.addonNames.indexOf(mod) !== -1;
                    return `<td><input type="checkbox" data-event="${event.name}" data-addon="${mod}" data-initial="${isActive}" ${isActive ? "checked" : ""}/></td>`
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

            const missingMods = [];
            events.forEach(event => event.addonNames.forEach(mod => {
                if ((modList.indexOf(mod) === -1) && (missingMods.indexOf(mod) === -1)) {
                    missingMods.push(mod);
                }
            }));
            if (missingMods.length > 0) {
                alert(`DANGER! these mods seem to not be available, but they are part of existing events: ${missingMods.join(', ')}`);
            }
        });
}

function checkboxListener() {
    const checked = this.checked;
    const eventModel = eventsModel.find(event => event.name === this.dataset.event);
    const addon = this.dataset.addon;
    const eventAddonIndex = eventModel.addonNames.indexOf(addon);
    if ((eventAddonIndex !== -1) && !checked) {
        eventModel.addonNames = eventModel.addonNames.splice(eventAddonIndex, 1);
    }
    if ((eventAddonIndex === -1) && checked) {
        eventModel.addonNames.push(addon);
    }
}

document.querySelector('#save-event-list').addEventListener('click', submitEdit);
document.querySelector('#reload-event-list').addEventListener('click', displayEvents);

function submitEdit() {
    document.getElementById('save-event-list').enabled = false;
    document.getElementById('reload-event-list').enabled = false;
    httpPut('/api/events', eventsModel).then(() => {
        document.getElementById('save-event-list').enabled = true;
        document.getElementById('reload-event-list').enabled = true;
    }, (err) => {
        console.log(err);
        alert('halp, something bad happened');
    });
}

function httpGet(path) {
    return fetch(path, getOptions('GET'))
}

function httpPut(path, data) {
    return fetch(path, getOptions('PUT', data));
}

function getOptions(verb, data) {
    var options = {
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
