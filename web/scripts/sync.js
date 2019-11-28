let currentActionId = 0;

document.querySelector('#sync-update').addEventListener('click', async () => {
    if (currentActionId) {
        return false;
    }
    const request = await httpPost('/api/repo/action/update');
    if (request.status >= 300) {
        throw new Error('wtf');
    }
    const response = await request.json();
    currentActionId = response.action.id;

    document.querySelector('#sync-update').setAttribute('disabled', 'disabled');

    while(currentActionId) {
        const status = await (await httpGet('/api/repo/action/' + currentActionId)).json();
        document.querySelector('#last-update-status').innerHTML = status.message || status.status;
        if (status.status !== 'PENDING') {
            currentActionId = 0;
            document.querySelector('#sync-update').removeAttribute('disabled');
        }
        await sleep(1500);
    }
    await Promise.all([
        updateRepoInfo(),
        updateAddonlist(),
    ]);
});


async function updateRepoInfo() {
    const serverInfo = await (await httpGet('/api/repo')).json();
    ['revision', 'buildDate', 'numberOfFiles', 'totalFilesSize'].forEach((name) => {
        let content = serverInfo[name];

        let element = document.querySelector(`#${name}`);
        element.setAttribute('title', content);

        if (name === 'totalFilesSize') {
            content = formatMemory(content);
        }
        element.textContent = content;
    });
}

async function updateAddonlist() {
    const addons = await (await httpGet('/api/addons')).json();
    document.querySelector('#addon-names').innerHTML = addons.map(_ => _.name).map(name => {
        return `<span>${name}</span>`
    }).join('')
}


updateAddonlist();
updateRepoInfo();
