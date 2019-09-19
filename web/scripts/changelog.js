async function refresh() {
    const changelogResponse = await httpGet('/api/changelog');
    const changelogs = await changelogResponse.json();
    console.log(changelogs);

    document.querySelector('#changelog').innerHTML = '<ul style="list-style: none">' +
    changelogs.list.map(changelog => {
        return `<li>
                <h3>version: ${changelog.revision} (${changelog.buildDate})</h3>
                <div>${changelog.newAddons.length} new: ${changelog.newAddons.join(', ')}</div>
                <div>${changelog.updatedAddons.length} updated: ${changelog.updatedAddons.join(', ')}</div>
                <div>${changelog.deletedAddons.length} removed: ${changelog.deletedAddons.join(', ')}</div>
            </li>`;
    }).join('\n') + '</ul>';
}


refresh();
