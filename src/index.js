import * as VisNetwork from 'vis-network'

import 'modern-normalize/modern-normalize.css'
import './index.css'

const readConfigurationFromQueryParameters = () => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const server = urlSearchParams.get("server")
    const reload = Number(urlSearchParams.get("reload"))
    return {
        server,
        reload: reload === NaN || reload < 1 ? 0 : Math.floor(reload),
    }
}

const refillForm = (form) => (configuration) => {
    form.server.value = configuration.server
    form.reload.value = configuration.reload > 0 ? configuration.reload : ''
}

const fetchData = async (server) => {
    const response = await window.fetch(`${server}/v1/stats`, {
        method: 'GET',
        headers: {
            'Accept': 'text/vnd.graphviz; q=1.0'
        }
    })
    return response.text()
}

const drawData = (container, data) => {
    const parsedData = VisNetwork.parseDOTNetwork(data)
    new VisNetwork.Network(container, { nodes: parsedData.nodes, edges: parsedData.edges }, parsedData.options)
}

const main = async () => {
    const configurationForm = document.forms.configuration
    const container = document.getElementById('canvas')
    const configuration = readConfigurationFromQueryParameters()
    refillForm(configurationForm)(configuration)
    const data = await fetchData(configuration.server)
    drawData(container, data)
    if (configuration.reload > 0) {
        window.setInterval(() => {
            drawData(container, data)
        }, configuration.reload * 1000)
    }
}

main().catch(console.error)