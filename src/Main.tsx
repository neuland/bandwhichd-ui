import React, { useEffect, useState } from "react";
import { configuration } from "./Configuration";
import { Graph } from "./Graph";

import styles from "./Main.module.css"
import { NodeSelector } from "./NodeSelector";
import { fetchStats, HostId, Stats } from "./Stats";

export const Main: React.FC =
    () => {
        const [maybeStats, setMaybeStats] = useState<Stats | null>(null);
        const [maybeSelectedHostId, setMaybeSelectedHostId] = useState<HostId | null>(null);

        useEffect(() => {
            fetchStats(configuration).then(stats => {
                setMaybeStats(stats);
            }).catch(console.error);
        }, []);

        return <main className={styles.main}>
            <NodeSelector {...{ maybeStats, maybeSelectedHostId, setMaybeSelectedHostId }} />
            <Graph {...{ maybeSelectedHostId, setMaybeSelectedHostId }} />
        </main>;
    };