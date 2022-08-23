import fs from "fs"
import http from "http"
import path from "path"
import process from "process"

const port = 8080

const server = http.createServer((request, response) => {
    const chunks = []

    request.on("data", chunk => {
        chunks.push(chunk)
    })

    request.on("end", () => {
        if (request.method !== "GET"
            || request.url !== "/v1/stats") {
            response.writeHead(404)
            response.end()
            return
        }

        if (chunks.length > 0) {
            response.writeHead(400)
            response.end()
            return
        }

        const format =
            request.headers.accept === "text/vnd.graphviz; q=1.0"
                ? "dot"
                : "json"

        const filePath = path.join(process.cwd(), `stats.${format}`)
        const fileStat = fs.statSync(filePath)

        response.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Content-Length": fileStat.size
        })
        fs.createReadStream(filePath).pipe(response)
    })
})

server.listen(port, () => {
    console.log(`bandwhichd mock server listening on port ${port}`)
})