import React, { useEffect } from 'react';

import * as VisNetwork from 'vis-network'

import './App.css';
import { Configuration, configuration } from './Configuration';

const fetchData = async (configuration: Configuration): Promise<string> => {
  const response = await window.fetch(`${configuration.apiServer}/v1/stats`, {
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
    useEffect(() => {
      const maybeCanvas = document.getElementById("canvas");
      
      if (maybeCanvas === null) {
        return;
      }
      const canvas = maybeCanvas;
      
      fetchData(configuration).then(data => {
        drawData(canvas, data);
      }).catch(console.error);
    }, []);

    return <main>
      <section id="canvas" style={{ height: "calc(100% - 100px)" }}></section>
    </main>;
  };