async function refresh() {
    const autoconfigResponse = await httpGet('/api/autoconfig');
    const autoconfig = await autoconfigResponse.json();

    document.querySelector('#autoconfig').innerHTML = `
        <h3>${autoconfig.repositoryName}</h3>
        <div>url: ${autoconfig.protocole.url}</div>
        <div>port: ${autoconfig.protocole.port}</div>
    `;
}


refresh();
