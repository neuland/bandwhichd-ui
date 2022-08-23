import React, { useEffect, useRef } from "react";
import * as VisNetwork from "vis-network";
import { Configuration, configuration } from "./Configuration";

const fetchData = async (configuration: Configuration): Promise<string> => {
    const response = await window.fetch(`${configuration.apiServer}/v1/stats`, {
        method: "GET",
        headers: {
            "Accept": "text/vnd.graphviz; q=1.0"
        }
    });
    return response.text();
}

export const Graph: React.FC =
    () => {
        const containerRef = useRef<HTMLElement | null>(null);

        useEffect(() => {
            if (containerRef.current === null) {
                return;
            }
            const container = containerRef.current

            let network: VisNetwork.Network | null = null;
            fetchData(configuration).then(data => {
                // @ts-ignore
                const parsedData = VisNetwork.parseDOTNetwork(data);
                parsedData.options.physics = {
                    solver: "forceAtlas2Based"
                };
                network = new VisNetwork.Network(container, parsedData);
            }).catch(console.error);

            return () => {
                if (network !== null) {
                    network.destroy();
                }
            }
        }, [containerRef]);

        return <section ref={containerRef} style={{height: "calc(100% - 10px)"}}></section>;
    };