import fs from "fs"
import http from "http";
import path from "path"
import process from "process"
import type { Connect, ResolvedConfig } from "vite";

import { ServeHandler } from "../vite-plugin-serve-handler";

const isApiRoute: (url: string) => boolean =
    (url) => url === "/api" || url.startsWith("/api?") || url.startsWith("/api/");

const bandwhichdApiServerFromEnv: (viteConfig: ResolvedConfig) => URL | null =
    (viteConfig) => {
        const bandwhichdApiServer = viteConfig.env["BANDWHICHD_API_SERVER"];
        try {
            return new URL(bandwhichdApiServer);
        } catch (_) {
            return null;
        }
    };

const handleWithMocks =
    (request: Connect.IncomingMessage, response: http.ServerResponse) => {
        const chunks = [];
        request.on("data", chunk => {
            chunks.push(chunk);
        });

        request.on("end", () => {
            if (request.method !== "GET"
                || request.url !== "/api/v1/stats") {
                response.writeHead(404);
                response.end();
                return;
            }

            if (chunks.length > 0) {
                response.writeHead(400);
                response.end();
                return;
            }

            const format =
                request.headers.accept === "text/vnd.graphviz; q=1.0"
                    ? "dot"
                    : "json";

            const filePath = path.join(process.cwd(), 'mocks', `stats.${format}`);
            const fileStat = fs.statSync(filePath);

            response.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Content-Length": fileStat.size,
            });
            fs.createReadStream(filePath).pipe(response);
        });
    };

const handleWithServer =
    (request: Connect.IncomingMessage, response: http.ServerResponse, viteConfig: ResolvedConfig, bandwhichdApiServer: URL) => {
        const upstreamRequestOptions: http.RequestOptions = {
            protocol: bandwhichdApiServer.protocol,
            host: bandwhichdApiServer.hostname,
            port: bandwhichdApiServer.port,
            method: request.method,
            path: request.url.substring("/api".length),
            headers: {
                ...request.headers,
                host: `${bandwhichdApiServer.host}`,
            },
        };

        request.pipe(http.request(upstreamRequestOptions, (upstreamResponse) => {
            upstreamResponse.pipe(response).on("error", (error) => {
                viteConfig.logger.error("mocks/apiHandler: Error proxying response", {
                    error,
                    timestamp: true
                });
                response.end();
            });
        })).on("error", (error) => {
            viteConfig.logger.error("mocks/apiHandler: Error proxying request", {
                error,
                timestamp: true
            });
            response.end();
        });
    };

export const apiHandler: ServeHandler.Handler =
    (request, response, viteConfig) => {
        if (!isApiRoute(request.url)) {
            return false;
        }

        const bandwhichdApiServer = bandwhichdApiServerFromEnv(viteConfig);

        if (bandwhichdApiServer === null) {
            handleWithMocks(request, response);
        } else {
            handleWithServer(request, response, viteConfig, bandwhichdApiServer);
        }

        return true;
    };