import { Configuration } from "./Configuration";
import { Map } from "immutable";
import * as Decoder from "io-ts/lib/Decoder"
import { mapDecoder } from "./lib/immutable/io-ts/mapDecoder";
import { parseBodyAsJson, rejectNonOk } from "./lib/es/response/promiseUtils";
import { decode } from "./lib/io-ts/promiseUtils";


const hostIdTag = Symbol("HostId");
export type HostId = string & { readonly _tag: typeof hostIdTag; };
const createHostId: (value: string) => HostId = (value) => value as HostId;
export const hostIdDecoder = Decoder.map(createHostId)(Decoder.string);

const hostnameTag = Symbol("Hostname");
export type Hostname = string & { readonly _tag: typeof hostnameTag; };
const createHostname: (value: string) => Hostname = (value) => value as Hostname;
export const hostnameDecoder = Decoder.map(createHostname)(Decoder.string);

export interface Host {
    readonly hostname: Hostname;
}
export const hostDecoder = Decoder.struct({
    hostname: hostnameDecoder,
});

export interface Stats {
    hosts: Map<HostId, Host>
}
export const statsDecoder = Decoder.struct({
    hosts: mapDecoder(hostIdDecoder, hostDecoder),
});

export const fetchStats = 
    async (configuration: Configuration): Promise<Stats> =>
        await fetch(`${configuration.apiServer}/v1/stats`, {
            method: "GET",
            headers: {
                "Accept": "application/json; q=1.0"
            }
        })
        .then(rejectNonOk())
        .then(parseBodyAsJson())
        .then(decode(statsDecoder));