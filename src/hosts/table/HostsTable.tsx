import { Set } from "immutable";
import React from "react";
import { HostId, osReleaseToString, Stats } from "../Stats";
import styles from "./HostsTable.module.css"

export interface HostsTableProps {
    stats: Stats;
    setSelectedHostIdAndViewGraph: (hostId: HostId) => void;
}

export const HostsTable: React.FC<HostsTableProps> =
    ({ stats, setSelectedHostIdAndViewGraph }) => {
        const monitoredHostsIds: Set<HostId> = stats.hosts.keySeq().toSet();
        const unmonitoredHostsIds: Set<HostId> = stats.unmonitoredHosts.keySeq().toSet();
        return <table className={styles["hosts-table"]}>
            <thead>
                <tr>
                    <th rowSpan={2}>Hostname</th>
                    <th rowSpan={2}>os-release</th>
                    <th colSpan={2}>Connections to</th>
                    <th rowSpan={2}></th>
                </tr>
                <tr>
                    <th>Monitored hosts</th>
                    <th>Unmonitored hosts</th>
                </tr>
            </thead>
            <tbody>
                {
                    stats.hosts.entrySeq().sortBy(([_, host]) => host.hostname).map(([hostId, host]) => {
                        return <tr key={hostId}>
                            <td>{host.hostname}</td>
                            <td>{osReleaseToString(host.os_release)}</td>
                            <td className={styles.numeric}>{host.connections.keySeq().filter(connectionHostId => monitoredHostsIds.contains(connectionHostId)).count()}</td>
                            <td className={styles.numeric}>{host.connections.keySeq().filter(connectionHostId => unmonitoredHostsIds.contains(connectionHostId)).count()}</td>
                            <td>
                                <button onClick={_ => setSelectedHostIdAndViewGraph(hostId)}>view in graph</button>
                            </td>
                        </tr>;
                    }).toArray()
                }
            </tbody>
        </table>;
    };