import React, { useEffect, useRef, useState } from "react";
import * as VisNetwork from "vis-network";
import { HostId } from "./Stats";

import styles from "./Graph.module.css";

const fetchData = async (): Promise<string> => {
    const response = await window.fetch("/api/v1/stats", {
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
        const [isLoading, setIsLoading] = useState<Boolean>(true);
        const containerRef = useRef<HTMLDivElement | null>(null);
        const networkRef = useRef<VisNetwork.Network | null>(null);

        useEffect(() => {
            if (containerRef.current === null) {
                return;
            }
            const container = containerRef.current;

            setIsLoading(true);
            fetchData().then(data => {
                // @ts-ignore
                const parsedData = VisNetwork.parseDOTNetwork(data);
                parsedData.options.physics = {
                    solver: "forceAtlas2Based"
                };
                const network = new VisNetwork.Network(container, parsedData);
                network.on("selectNode", (event) => {
                    props.setMaybeSelectedHostId(event.nodes[0]);
                });
                network.on("afterDrawing", (_) => {
                    setIsLoading(false);
                });
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

        return <section>
            { isLoading && <span className={styles.loading}>Loading…</span> }
            <div className={styles.container} ref={containerRef}></div>
        </section>;
    };