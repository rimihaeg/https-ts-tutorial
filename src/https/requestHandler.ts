import { request as sender } from "https";

/**
 * Sends out an http request
 * @param options   Array of HTTP options
 * @param body      Optional body to send with the request
 */
export function request(options: any, body?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        const req = sender(options, res => {
            resolve(res);
        }).on("error", err => {
            reject(err);
        }).end(body);
    });
}
