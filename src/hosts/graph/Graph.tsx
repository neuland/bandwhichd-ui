import React, { useEffect, useRef, useState } from "react";
import * as VisNetwork from "vis-network";
import { HostId, Stats } from "../Stats";

import styles from "./Graph.module.css";
import { Seq } from "immutable";

export interface GraphProps {
    maybeStats: Stats | null;
    maybeSelectedHostId: HostId | null,
    setMaybeSelectedHostId: (maybeSelectedHostId: HostId | null) => void,
}

export const Graph: React.FC<GraphProps> =
    (props) => {
        const [isLoading, setIsLoading] = useState<Boolean>(true);
        const containerRef = useRef<HTMLDivElement | null>(null);
        const networkRef = useRef<VisNetwork.Network | null>(null);

        useEffect(() => {
            if (containerRef.current === null
                || props.maybeStats === null) {
                return;
            }
            const container = containerRef.current;
            const stats = props.maybeStats;

            setIsLoading(true);
            const hostNodes: Seq.Indexed<VisNetwork.Node> =
                stats.hosts
                    .entrySeq()
                    .map(([hostId, host]) => ({
                        id: hostId,
                        label: host.hostname,
                    }));
            const unmonitoredHostNodes: Seq.Indexed<VisNetwork.Node> =
                stats.unmonitoredHosts
                    .entrySeq()
                    .map(([hostId, unmonitoredHost]) => ({
                        id: hostId,
                        label: unmonitoredHost.host,
                    }));
            const edges: Seq.Indexed<VisNetwork.Edge> =
                stats.hosts
                    .entrySeq()
                    .flatMap(([hostId, host]) =>
                        host.connections
                            .entrySeq()
                            .map(([otherHostId, _]) => ({
                                from: hostId,
                                to: otherHostId,
                            }))
                    );
            const data: VisNetwork.Data = {
                nodes: hostNodes.concat(unmonitoredHostNodes).toArray(),
                edges: edges.toArray(),
            };
            const options: VisNetwork.Options = {
                physics: {
                    solver: "forceAtlas2Based"
                }
            };
            const network = new VisNetwork.Network(container, data, options);
            network.on("selectNode", (event) => {
                props.setMaybeSelectedHostId(event.nodes[0]);
            });
            network.on("afterDrawing", (_) => {
                setIsLoading(false);
            });
            networkRef.current = network;

            return () => {
                if (networkRef.current !== null) {
                    networkRef.current.destroy();
                }
            }
        }, [containerRef, props.maybeStats]);

        useEffect(() => {
            if (networkRef.current !== null && props.maybeSelectedHostId !== null) {
                networkRef.current.selectNodes([props.maybeSelectedHostId]);
            }
        }, [networkRef, props.maybeSelectedHostId]);

        return <section>
            {isLoading && <span className={styles.loading}>Loading…</span>}
            <div className={styles.container} ref={containerRef}></div>
        </section>;
    };