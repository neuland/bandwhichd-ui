import React from "react";
import { Host, HostId, Stats } from "../Stats";
import { Graph } from "./Graph";
import { HostDetails } from "./HostDetails";
import { NodeSelector } from "./NodeSelector";
import styles from "./GraphPage.module.css"

export interface GraphPageProps {
    maybeStats: Stats | null;
    maybeSelectedHost: Host & { hostId: HostId } | null,
    maybeSelectedHostId: HostId | null,
    setMaybeSelectedHostId: (maybeSelectedHostId: HostId | null) => void,
}

export const GraphPage: React.FC<GraphPageProps> =
    ({ maybeStats, maybeSelectedHost, maybeSelectedHostId, setMaybeSelectedHostId }) => {
        return <main className={styles.main}>
            <NodeSelector {...{ maybeStats, maybeSelectedHostId, setMaybeSelectedHostId }} />
            <Graph {...{ maybeStats, maybeSelectedHostId, setMaybeSelectedHostId }} />
            <HostDetails {...{ maybeStats, maybeSelectedHost, setMaybeSelectedHostId }} />
        </main>;
    };