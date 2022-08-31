import React, { useEffect, useState } from "react";
import { Graph } from "./Graph";
import { HostDetails } from "./HostDetails";

import styles from "./Main.module.css"
import { NodeSelector } from "./NodeSelector";
import { fetchStats, Host, HostId, Stats } from "./Stats";

export const Main: React.FC =
    () => {
        const [maybeStats, setMaybeStats] = useState<Stats | null>(null);
        const [maybeSelectedHostId, setMaybeSelectedHostId] = useState<HostId | null>(null);

        const maybeSelectedHostWithoutId =
            maybeStats === null || maybeSelectedHostId === null
                ? null
                : maybeStats.hosts.get(maybeSelectedHostId, null)

        const maybeSelectedHost: Host & { hostId: HostId } | null =
            maybeSelectedHostId === null || maybeSelectedHostWithoutId == null
                ? null
                : { hostId: maybeSelectedHostId, ...maybeSelectedHostWithoutId };

        useEffect(() => {
            fetchStats().then(stats => {
                setMaybeStats(stats);
            }).catch(console.error);
        }, []);

        return <main className={styles.main}>
            <NodeSelector {...{ maybeStats, maybeSelectedHostId, setMaybeSelectedHostId }} />
            <Graph {...{ maybeSelectedHostId, setMaybeSelectedHostId }} />
            <HostDetails {...{ maybeStats, maybeSelectedHost, setMaybeSelectedHostId }} />
        </main>;
    };