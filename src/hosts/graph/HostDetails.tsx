import React, { useState } from "react";
import { Map } from "immutable";
import { Connection, Host, HostId, osReleaseToString, Stats, UnmonitoredHost } from "../Stats";

import style from "./HostDetails.module.css";

export interface HostDetailsProps {
    maybeStats: Stats | null;
    maybeSelectedHost: Host & { hostId: HostId } | null;
    setMaybeSelectedHostId: (maybeSelectedHostId: HostId | null) => void,
}

export const HostDetails: React.FC<HostDetailsProps> =
    (props) => {
        if (props.maybeSelectedHost === null) {
            return null;
        }
        const selectedHost = props.maybeSelectedHost;

        const osReleasName: string = osReleaseToString(selectedHost.os_release);
        const [showOsReleaseDetails, setShowOsReleaseDetails] = useState<boolean>(false);

        const connectionsToMonitoredHosts = selectedHost
            .connections
            .flatMap<HostId, { hostDetails: Host, connectionDetails: Connection }>((connection, hostId) => {
                if (props.maybeStats === null) {
                    return Map<HostId, { hostDetails: Host, connectionDetails: Connection }>();
                }
                const stats = props.maybeStats;

                const maybeMonitoredHost = stats.hosts.get(hostId, null);
                if (maybeMonitoredHost === null) {
                    return Map<HostId, { hostDetails: Host, connectionDetails: Connection }>();
                }
                const monitoredHost = maybeMonitoredHost;

                return Map<HostId, { hostDetails: Host, connectionDetails: Connection }>({
                    [hostId]: {
                        hostDetails: monitoredHost,
                        connectionDetails: connection,
                    },
                });
            });

        const connectionsToUnmonitoredHosts = selectedHost
            .connections
            .flatMap<HostId, { unmonitoredHostDetails: UnmonitoredHost, connectionDetails: Connection }>((connection, hostId) => {
                if (props.maybeStats === null) {
                    return Map<HostId, { unmonitoredHostDetails: UnmonitoredHost, connectionDetails: Connection }>();
                }
                const stats = props.maybeStats;

                const maybeUnmonitoredHost = stats.unmonitoredHosts.get(hostId, null);
                if (maybeUnmonitoredHost === null) {
                    return Map<HostId, { unmonitoredHostDetails: UnmonitoredHost, connectionDetails: Connection }>();
                }
                const unmonitoredHost = maybeUnmonitoredHost;

                return Map<HostId, { unmonitoredHostDetails: UnmonitoredHost, connectionDetails: Connection }>({
                    [hostId]: {
                        unmonitoredHostDetails: unmonitoredHost,
                        connectionDetails: connection,
                    },
                });
            });

        return <aside className={style["host-details"]}>
            <section>
                <p>{selectedHost.hostname}</p>
                <p>OS: {osReleasName} {selectedHost.os_release && <button onClick={_ => setShowOsReleaseDetails(!showOsReleaseDetails)}>{showOsReleaseDetails ? "-" : "+"}</button>}</p>
                {
                    selectedHost.os_release && showOsReleaseDetails &&
                    <table>
                        <tbody>
                            <tr>
                                <td>Pretty name:</td>
                                <td>
                                    <code>{selectedHost.os_release?.pretty_name}</code>
                                </td>
                            </tr>
                            <tr>
                                <td>Id:</td>
                                <td>
                                    <code>{selectedHost.os_release?.id}</code>
                                </td>
                            </tr>
                            <tr>
                                <td>Version id:</td>
                                <td>
                                    <code>{selectedHost.os_release?.version_id}</code>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                }
            </section>
            <section>
                {
                    connectionsToMonitoredHosts.isEmpty() && <p>No connections to monitored hosts</p>
                }
                {
                    !connectionsToMonitoredHosts.isEmpty() && <>
                        <p>Connections to monitored hosts:</p>
                        <ul>
                            {
                                connectionsToMonitoredHosts
                                    .entrySeq()
                                    .sortBy(([_, { hostDetails }]) => hostDetails.hostname)
                                    .map(([hostId, { hostDetails }]) => <li key={hostId}>
                                        {
                                            hostId === selectedHost.hostId
                                                ? <button disabled>{hostDetails.hostname}</button>
                                                : <button onClick={_ => props.setMaybeSelectedHostId(hostId)}>{hostDetails.hostname}</button>
                                        }
                                    </li>)
                            }
                        </ul>
                    </>
                }
            </section>
            <section>
                {
                    connectionsToUnmonitoredHosts.isEmpty() && <p>No connections to unmonitored hosts</p>
                }
                {
                    !connectionsToUnmonitoredHosts.isEmpty() && <>
                        <p>Connections to unmonitored hosts:</p>
                        <ul>
                            {
                                connectionsToUnmonitoredHosts
                                    .entrySeq()
                                    .sortBy(([_, { unmonitoredHostDetails }]) => unmonitoredHostDetails.host)
                                    .map(([hostId, { unmonitoredHostDetails }]) => <li key={hostId}>{unmonitoredHostDetails.host}</li>)
                            }
                        </ul>
                    </>
                }
            </section>
        </aside>;
    };