import React from "react";

import styles from "./Footer.module.css";

export const Footer: React.FC =
    () => <footer className={styles.footer}>bandwhichd | Made by <a href="https://www.neuland-bfi.de/" rel="noreferrer">neuland – Büro für Informatik GmbH</a> | <a href="https://github.com/neuland/bandwhichd-ui" rel="noreferrer">Source</a></footer>;