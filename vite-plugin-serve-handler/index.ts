import http from "http";
import type { Connect, Plugin, ResolvedConfig, ViteDevServer } from "vite";

export namespace ServeHandler {
    export type Handler = (request: Connect.IncomingMessage, response: http.ServerResponse, viteConfig: ResolvedConfig) => boolean;
}

const serverHandlerMiddleware: (config: ResolvedConfig, options: FinalServerHandlerOptions) => Connect.NextHandleFunction =
    (config, options) => (request, response, next) => {
        try {
            if (!options.handler(request, response, config)) {
                next();
            }
        } catch (error) {
            config.logger.error("vite-plugin-serve-handler: handler error", {
                error,
                timestamp: true
            });
            next();
        }
    };

export interface ServeHandlerOptions {
    handler?: ServeHandler.Handler;
}

interface FinalServerHandlerOptions {
    handler: ServeHandler.Handler;
}

const defaultServeHandlerOptions: FinalServerHandlerOptions = {
    handler: (_, __) => false,
};

export const ServeHandler: (options?: ServeHandlerOptions) => Plugin =
    (givenOptions) => {
        let config: ResolvedConfig | null = null;
        const options: FinalServerHandlerOptions =
            typeof givenOptions !== "object"
                ? defaultServeHandlerOptions
                : { ...defaultServeHandlerOptions, ...givenOptions };
        return {
            name: "vite-plugin-serve-handler",
            apply: "serve",
            configResolved: (resolvedConfig) => {
                config = resolvedConfig;
            },
            configureServer: (server: ViteDevServer) => {
                server.middlewares.use(serverHandlerMiddleware(config, options));
            },
        };
    };