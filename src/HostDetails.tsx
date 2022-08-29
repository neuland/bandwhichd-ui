import { Host } from "./Stats";

import style from "./HostDetails.module.css";

export interface HostDetailsProps {
    maybeSelectedHost: Host | null;
}

export const HostDetails: React.FC<HostDetailsProps> =
    (props) => {
        if (props.maybeSelectedHost === null) {
            return null;
        }
        const selectedHost = props.maybeSelectedHost;

        return <aside className={style.hostDetails}>
            <section>
                <p>{selectedHost.hostname}</p>
            </section>
        </aside>;
    };