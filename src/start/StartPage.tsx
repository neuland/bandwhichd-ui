import { Seq } from "immutable";
import React from "react";
import { PageId } from "../PageId";
import styles from "./StartPage.module.css";

export interface StartPageProps {
    setCurrentPageId: (pageId: PageId) => void,
}

const pages = Seq.Indexed([
    {
        pageId: PageId.hostsTable,
        title: "Hosts table",
        summary: "Listing of all monitored hosts and their main properties",
    },
    {
        pageId: PageId.hostsGraph,
        title: "Hosts graph",
        summary: "Graph of all monitored hosts and their connections",
    },
]);

export const StartPage: React.FC<StartPageProps> =
    ({ setCurrentPageId }) => {
        return <main className={styles["start-page"]}>
            <nav>
                <ul>
                    {pages.map(page =>
                        <li>
                            <button onClick={_ => setCurrentPageId(page.pageId)}>
                                <div className={styles.title}>{page.title}</div>
                                <div className={styles.summary}>{page.summary}</div>
                            </button>
                        </li>
                    ).toArray()}
                </ul>
            </nav>
        </main>;
    };