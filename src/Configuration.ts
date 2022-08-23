export interface Configuration {
    apiServer: string;
}

if (import.meta.env.DEV) {
    // @ts-ignore
    document.configuration = {
        apiServer: import.meta.env.BANDWHICHD_API_SERVER,
    };
}

// @ts-ignore
export const configuration: Configuration = document.configuration