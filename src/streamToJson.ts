import { Readable } from 'stream';
import { IncomingMessage } from 'http';

const inStream = new Readable();

export default function streamToJson(inc: IncomingMessage): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        let body = "";
        inc.on("data", chunk => {
            console.log("data!");
            body += chunk
        });

        inc.on("end", () => body === null ? resolve(null) : resolve(JSON.parse(body)));

        inc.on("error", err => {
            console.log("error!")
            reject(err)
        });
    });    
}