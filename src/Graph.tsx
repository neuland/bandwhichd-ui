import React, { useEffect, useRef } from "react";
import * as VisNetwork from "vis-network";
import { Configuration, configuration } from "./Configuration";
import { HostId } from "./Stats";

const fetchData = async (configuration: Configuration): Promise<string> => {
    const response = await window.fetch(`${configuration.apiServer}/v1/stats`, {
        method: "GET",
        headers: {
            "Accept": "text/vnd.graphviz; q=1.0"
        }
    });
    return response.text();
}

export interface GraphProps {
    maybeSelectedHostId: HostId | null,
    setMaybeSelectedHostId: (maybeSelectedHostId: HostId | null) => void,
}

export const Graph: React.FC<GraphProps> =
    (props) => {
        const containerRef = useRef<HTMLElement | null>(null);
        const networkRef = useRef<VisNetwork.Network | null>(null);

        useEffect(() => {
            if (containerRef.current === null) {
                return;
            }
            const container = containerRef.current

            fetchData(configuration).then(data => {
                // @ts-ignore
                const parsedData = VisNetwork.parseDOTNetwork(data);
                parsedData.options.physics = {
                    solver: "forceAtlas2Based"
                };
                const network = new VisNetwork.Network(container, parsedData);
                network.on("selectNode", (event) => {
                    props.setMaybeSelectedHostId(event.nodes[0]);
                })
                networkRef.current = network;
            }).catch(console.error);

            return () => {
                if (networkRef.current !== null) {
                    networkRef.current.destroy();
                }
            }
        }, [containerRef]);

        useEffect(() => {
            if (networkRef.current !== null && props.maybeSelectedHostId !== null) {
                networkRef.current.selectNodes([props.maybeSelectedHostId]);
            }
        }, [networkRef, props.maybeSelectedHostId]);

        return <section ref={containerRef} style={{ height: "calc(100% - 100px)" }}></section>;
    };