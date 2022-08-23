import React from "react";
import { Graph } from "./Graph";

import styles from "./Main.module.css"

export const Main: React.FC =
    () => <main className={styles.main}>
        <Graph />
    </main>;