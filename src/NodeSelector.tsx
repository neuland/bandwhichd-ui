import React from "react";
import { HostId, Stats } from "./Stats";

import styles from "./NodeSelector.module.css";

export interface NodeSelectorProps {
    maybeStats: Stats | null,
    maybeSelectedHostId: HostId | null,
    setMaybeSelectedHostId: (maybeSelectedHostId: HostId | null) => void,
}

export const NodeSelector: React.FC<NodeSelectorProps> =
    (props) => {
        if (props.maybeStats === null) {
            return null;
        }

        const stats = props
            .maybeStats
            .hosts
            .entrySeq()
            .sortBy(([_, host]) => host.hostname)
            .map(([hostId, host]) => {
                return <li key={hostId}>{
                    hostId === props.maybeSelectedHostId
                        ? <button disabled>{host.hostname}</button>
                        : <button onClick={_ => props.setMaybeSelectedHostId(hostId)}>{host.hostname}</button>
                }</li>;
            })
            .toArray();

        return <aside className={styles["node-selector"]}>
            <section>
                <ul>{stats}</ul>
            </section>
        </aside>;
    };