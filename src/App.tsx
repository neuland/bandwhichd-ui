import React, { useEffect, useState } from "react";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { HostsPage } from "./hosts/HostsPage";
import { PageId } from "./PageId";
import { StartPage } from "./start/StartPage";

export const App: React.FC =
    () => {
        const [currentPageId, setCurrentPageId] = useState<PageId>(PageId.start);

        return <>
            <Header {...{ currentPageId, setCurrentPageId }} />
            {
                currentPageId === PageId.start
                    ? <StartPage {...{ setCurrentPageId }}></StartPage>
                    : currentPageId === PageId.hostsTable || currentPageId === PageId.hostsGraph
                        ? <HostsPage {...{ currentPageId, setCurrentPageId }}></HostsPage>
                        : null
            }
            <Footer />
        </>;
    };