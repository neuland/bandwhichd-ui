import { Map } from "immutable";
import * as Decoder from "io-ts/lib/Decoder"
import { mapDecoder } from "./lib/immutable/io-ts/mapDecoder";
import { parseBodyAsJson, rejectNonOk } from "./lib/es/response/promiseUtils";
import { decode } from "./lib/io-ts/promiseUtils";


const hostIdTag = Symbol("HostId");
export type HostId = string & { readonly _tag: typeof hostIdTag; };
const createHostId: (value: string) => HostId = (value) => value as HostId;
const hostIdDecoder = Decoder.map(createHostId)(Decoder.string);

const hostnameTag = Symbol("Hostname");
export type Hostname = string & { readonly _tag: typeof hostnameTag; };
const createHostname: (value: string) => Hostname = (value) => value as Hostname;
const hostnameDecoder = Decoder.map(createHostname)(Decoder.string);

export interface Connection { }
const connectionDecoder = Decoder.struct({});

export interface Host {
    readonly hostname: Hostname;
    readonly connections: Map<HostId, Connection>;
}
const hostDecoder = Decoder.struct({
    hostname: hostnameDecoder,
    connections: mapDecoder(hostIdDecoder, connectionDecoder),
});

export interface UnmonitoredHost {
    host: string;
}
const unmonitoredHostDecoder = Decoder.struct({
    host: Decoder.string,
});

export interface Stats {
    hosts: Map<HostId, Host>;
    unmonitoredHosts: Map<HostId, UnmonitoredHost>;
}
const statsDecoder = Decoder.struct({
    hosts: mapDecoder(hostIdDecoder, hostDecoder),
    unmonitoredHosts: mapDecoder(hostIdDecoder, unmonitoredHostDecoder),
});

export const fetchStats =
    async (): Promise<Stats> =>
        await window.fetch("/api/v1/stats", {
            method: "GET",
            headers: {
                "Accept": "application/json; q=1.0"
            }
        })
            .then(rejectNonOk())
            .then(parseBodyAsJson())
            .then(decode(statsDecoder));