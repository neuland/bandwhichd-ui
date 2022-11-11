import { Map } from "immutable";
import * as Decoder from "io-ts/lib/Decoder"
import { mapDecoder } from "../lib/immutable/io-ts/mapDecoder";
import { parseBodyAsJson, rejectNonOk } from "../lib/es/response/promiseUtils";
import { decode } from "../lib/io-ts/promiseUtils";
import { undefinedAsNullDecoder } from "../lib/io-ts/undefinedAsNullDecoder";


const hostIdTag = Symbol("HostId");
export type HostId = string & { readonly _tag: typeof hostIdTag; };
const createHostId: (value: string) => HostId = (value) => value as HostId;
const hostIdDecoder = Decoder.map(createHostId)(Decoder.string);

const hostnameTag = Symbol("Hostname");
export type Hostname = string & { readonly _tag: typeof hostnameTag; };
const createHostname: (value: string) => Hostname = (value) => value as Hostname;
const hostnameDecoder = Decoder.map(createHostname)(Decoder.string);

const osReleaseIdTag = Symbol("OsReleaseId");
export type OsReleaseId = string & { readonly _tag: typeof osReleaseIdTag; };
const createOsReleaseId: (value: string) => OsReleaseId = (value) => value as OsReleaseId;
const osReleaseIdDecoder = Decoder.map(createOsReleaseId)(Decoder.string);

const osReleasePrettyNameTag = Symbol("OsReleasePrettyName");
export type OsReleasePrettyName = string & { readonly _tag: typeof osReleasePrettyNameTag; };
const createOsReleasePrettyName: (value: string) => OsReleasePrettyName = (value) => value as OsReleasePrettyName;
const osReleasePrettyNameDecoder = Decoder.map(createOsReleasePrettyName)(Decoder.string);

const osReleaseVersionIdTag = Symbol("OsReleaseVersionId");
export type OsReleaseVersionId = string & { readonly _tag: typeof osReleaseVersionIdTag; };
const createOsReleaseVersionId: (value: string) => OsReleaseVersionId = (value) => value as OsReleaseVersionId;
const osReleaseVersionIdDecoder = Decoder.map(createOsReleaseVersionId)(Decoder.string);

export interface OsRelease {
    readonly id: OsReleaseId | null;
    readonly pretty_name: OsReleasePrettyName | null;
    readonly version_id: OsReleaseVersionId | null;
}
const osReleaseDecoder = Decoder.struct({
    id: undefinedAsNullDecoder(osReleaseIdDecoder),
    pretty_name: undefinedAsNullDecoder(osReleasePrettyNameDecoder),
    version_id: undefinedAsNullDecoder(osReleaseVersionIdDecoder),
});
export const osReleaseToString: (maybeOsRelease: OsRelease | null) => string =
    (maybeOsRelease) =>
        maybeOsRelease === null
            ? "Unknown"
            : maybeOsRelease.pretty_name !== null
                && maybeOsRelease.pretty_name.length > 0
                ? maybeOsRelease.pretty_name
                : `${maybeOsRelease.id} ${maybeOsRelease.version_id}`;

export interface Connection { }
const connectionDecoder = Decoder.struct({});

export interface Host {
    readonly hostname: Hostname;
    readonly os_release: OsRelease | null;
    readonly connections: Map<HostId, Connection>;
}
const hostDecoder = Decoder.struct({
    hostname: hostnameDecoder,
    os_release: undefinedAsNullDecoder(osReleaseDecoder),
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