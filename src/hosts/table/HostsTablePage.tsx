import React from "react";
import { HostId, Stats } from "../Stats";
import { HostsTable } from "./HostsTable";

import styles from "./HostsTablePage.module.css";

export interface HostsTablePageProps {
    stats: Stats;
    setSelectedHostIdAndViewGraph: (hostId: HostId) => void;
}

export const HostsTablePage: React.FC<HostsTablePageProps> =
    ({ stats, setSelectedHostIdAndViewGraph }) => {
        return <main className={styles.main}>
            <HostsTable {...{ stats, setSelectedHostIdAndViewGraph }} />
        </main>;
    };