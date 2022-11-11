import React, { useEffect, useState } from "react";
import { PageId } from "../PageId";
import { GraphPage } from "./graph/GraphPage";
import { fetchStats, Host, HostId, Stats } from "./Stats";
import { HostsTablePage } from "./table/HostsTablePage";

export interface HostsPageProps {
    currentPageId: PageId;
    setCurrentPageId: (currentPageId: PageId) => void;
}

export const HostsPage: React.FC<HostsPageProps> =
    ({ currentPageId, setCurrentPageId }) => {
        const [maybeStats, setMaybeStats] = useState<Stats | null>(null);
        const [maybeSelectedHostId, setMaybeSelectedHostId] = useState<HostId | null>(null);

        useEffect(() => {
            fetchStats().then(stats => {
                setMaybeStats(stats);
            }).catch(console.error);
        }, []);

        if (maybeStats === null) {
            return <p>Loading…</p>;
        }
        const stats = maybeStats;

        const maybeSelectedHostWithoutId =
            maybeSelectedHostId === null
                ? null
                : stats.hosts.get(maybeSelectedHostId, null)

        const maybeSelectedHost: Host & { hostId: HostId } | null =
            maybeSelectedHostId === null || maybeSelectedHostWithoutId == null
                ? null
                : { hostId: maybeSelectedHostId, ...maybeSelectedHostWithoutId };

        const setSelectedHostIdAndViewGraph: (hostId: HostId) => void =
            (hostId) => {
                setMaybeSelectedHostId(hostId);
                setCurrentPageId(PageId.hostsGraph);
            };

        return currentPageId === PageId.hostsTable
            ? <HostsTablePage {...{ stats, setSelectedHostIdAndViewGraph }} />
            : <GraphPage {...{ maybeStats, maybeSelectedHost, maybeSelectedHostId, setMaybeSelectedHostId }} />
    };