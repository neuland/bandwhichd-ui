const pageIdValues = [
    "hosts-graph",
    "hosts-table",
    "start",
] as const;
const pageIdTag = Symbol("PageId");
export type PageId = string & { readonly _tag: typeof pageIdTag; };
export namespace PageId {
    export const hostsGraph = "hosts-graph" as PageId;
    export const hostsTable = "hosts-table" as PageId;
    export const start = "start" as PageId;
    export const all = [ hostsGraph, hostsTable, start ] as const;
}