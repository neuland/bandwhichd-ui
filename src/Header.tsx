import React from "react";
import { configuration } from "./Configuration";

import styles from "./Header.module.css"

export const Header: React.FC =
    () => <header className={styles.header}>Connected to <code>{configuration.apiServer}</code></header>;