import React, { useEffect, useState } from 'react';

import * as VisNetwork from 'vis-network'

import './App.css';

interface Configuration {
  server: string;
}

const readConfigurationFromQueryParameters: () => Configuration =
  () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const server = urlSearchParams.get("server") || "";
    return {
      server,
    };
  };

const fetchData = async (server: string): Promise<string> => {
  const response = await window.fetch(`${server}/v1/stats`, {
    method: 'GET',
    headers: {
      'Accept': 'text/vnd.graphviz; q=1.0'
    }
  });
  return response.text();
}

const drawData = (container: HTMLElement, data: string) => {
  // @ts-ignore
  const parsedData = VisNetwork.parseDOTNetwork(data);
  const options = parsedData.options;
  options.physics = {
    solver: 'forceAtlas2Based'
  };
  new VisNetwork.Network(container, { nodes: parsedData.nodes, edges: parsedData.edges }, options);
}

export const App: React.FC =
  () => {
    const [ server, setServer ] = useState<string>("");

    useEffect(() => {
      const maybeCanvas = document.getElementById("canvas");
      
      if (maybeCanvas === null) {
        return;
      }
      const canvas = maybeCanvas;
      
      const configuration = readConfigurationFromQueryParameters();
      
      setServer(configuration.server);

      if (configuration.server === "") {
        return;
      }
      
      fetchData(configuration.server).then(data => {
        drawData(canvas, data);
      }).catch(console.error);
    }, []);

    return (
      <>
        <header>
          <nav>
            <form method="get" name="configuration">
              <label htmlFor="server">Server</label>
              <input type="url" name="server" id="server" value={server} onChange={e => setServer(e.target.value)} />
              <button type="submit">Submit</button>
            </form>
          </nav>
        </header>
        <main>
          <section id="canvas" style={{ height: "calc(100% - 100px)" }}></section>
        </main>
      </>
    );
  };