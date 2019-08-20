/******************************************************************************
 *                          Fetch and display users
 ******************************************************************************/

displayEvents();


function displayEvents() {
    httpGet('/api/events')
        .then(response => response.json())
        .then((response) => {
            let events = response.list;
            let eventContainer = document.getElementById('event-list');
            let thList = events.map(event => `<th title="${event.description}">${event.name}</th>`);
            let modList = unique(events.map(event => Object.getOwnPropertyNames(event.addonNames)).reduce((prev, cur) => prev.concat(cur), [])).sort();
            let rows = modList.map(mod => {
                let modCell = `<th scope="row">${mod}</th>`;
                let cells = events.map(event => {
                    let isActive = event.addonNames[mod] !== undefined;
                    return `<td><input type="checkbox" name="${event.name}_${mod}" value="${isActive}" ${isActive ? "checked" : ""}/></td>`
                });
                return `<tr>${modCell} ${cells.join('')}</tr>`
            });

            eventContainer.innerHTML = `<table>
                    <thead>
                        <th></th>${thList.join()}                  
                    </thead>
                    <tbody>
                        ${rows.join('\n')}
                    </tbody>
                    <tfoot><th></th>${thList.join()}</tfoot>
                </table>
                `;
        });
}

function unique(array) {
    let existing = [];
    return array.filter((element) => {
        if (existing.indexOf(element) === -1) {
            existing.push(element);
            return true;
        }
    })
}

/******************************************************************************
 *                        Add, Edit, and Delete Users
 ******************************************************************************/

document.getElementById('save-event-list').addEventListener('click', () => {
    let eventList = []; // TODO the api structure is shit. this must be improved
    document.querySelectorAll('#event-list input[type=checkbox]').forEach((checkbox) => {
        if (checkbox.checked) {

        }
    });
});

document.addEventListener('click', function (event) {
    event.preventDefault();
    if (event.target.matches('#add-user-btn')) {
        addUser();
    } else if (event.target.matches('.edit-user-btn')) {
        showEditView();
    } else if (event.target.matches('.cancel-edit-btn')) {
        cancelEdit();
    } else if (event.target.matches('.submit-edit-btn')) {
        submitEdit();
    } else if (event.target.matches('.delete-user-btn')) {
        deleteUser();
    }
}, false);


function addUser() {
    var nameInput = document.getElementById('name-input');
    var emailInput = document.getElementById('email-input');
    var data = {
        user: {
            name: nameInput.value,
            email: emailInput.value
        },
    };
    httpPost('/api/users/add', data)
        .then(() => {
            displayUsers();
        })
}


function showEditView() {
    var userEle = event.target.parentNode.parentNode;
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'none';
    editView.style.display = 'block';
}


function cancelEdit() {
    var userEle = event.target.parentNode.parentNode;
    var normalView = userEle.getElementsByClassName('normal-view')[0];
    var editView = userEle.getElementsByClassName('edit-view')[0];
    normalView.style.display = 'block';
    editView.style.display = 'none';
}


function submitEdit() {
    var userEle = event.target.parentNode.parentNode;
    var nameInput = userEle.getElementsByClassName('name-edit-input')[0];
    var emailInput = userEle.getElementsByClassName('email-edit-input')[0];
    var id = event.target.getAttribute('data-user-id');
    var data = {
        user: {
            name: nameInput.value,
            email: emailInput.value,
            id: id
        }
    };
	httpPut('/api/users/update', data)
        .then(() => {
            displayUsers();
        })
}


function deleteUser() {
    var id = event.target.getAttribute('data-user-id');
	httpDelete('/api/users/delete/' + id)
        .then(() => {
            displayUsers();
        })
}


function httpGet(path) {
    return fetch(path, getOptions('GET'))
}


function httpPost(path, data) {
    return fetch(path, getOptions('POST', data));
}


function httpPut(path, data) {
    return fetch(path, getOptions('PUT', data));
}


function httpDelete(path) {
    return fetch(path, getOptions('DELETE'));
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
