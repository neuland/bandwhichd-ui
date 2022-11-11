import React from "react";

import styles from "./Header.module.css"
import { PageId } from "./PageId";

export interface HeaderProps {
    currentPageId: PageId,
    setCurrentPageId: (pageId: PageId) => void,
}

export const Header: React.FC<HeaderProps> =
    ({ setCurrentPageId }) =>
        <header className={styles.header}>
            <nav>
                <ul>
                    <li>
                        <button onClick={_ => setCurrentPageId(PageId.start)}>Start</button>
                    </li>
                    <li>
                        <button onClick={_ => setCurrentPageId(PageId.hostsTable)}>Hosts table</button>
                    </li>
                    <li>
                        <button onClick={_ => setCurrentPageId(PageId.hostsGraph)}>Hosts graph</button>
                    </li>
                </ul>
            </nav>
        </header>;