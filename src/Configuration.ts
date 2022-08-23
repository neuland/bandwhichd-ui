export interface Configuration {
    apiServer: string;
}

if (process.env.NODE_ENV !== "production") {
    // @ts-ignore
    document.configuration = {
        apiServer: process.env.REACT_APP_API_SERVER ?? "http://localhost:8080",
    };
}

// @ts-ignore
export const configuration: Configuration = document.configuration