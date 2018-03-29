import { request as request } from "./requestHandler";
import { IncomingMessage } from "http";

/**
 * Create a request with the following info:
 * @param path 		URL path to send the request to
 * @param method 	HTTP method for the request, defaults to GET
 * @param body 		Optional body to send with the request
 */
const requestWithOptions = (host:string, path:string, method?:string, body?: string): Promise<IncomingMessage> => {	
	if (path.charAt(0) !== "/") path = "/" + path; //make sure the first character of the path is a "/"
	const options = {
		host: host,
		path: path,
		method: method || 'GET',
		headers: {
		"Accept": "application/json",
		"Content-Type": "application/json; charset=utf8"
		}
	}
	if (body) {
		(options.headers as any)["Content-Length"] = Buffer.byteLength(body);
		return request(options, body);
	} else return request(options);
}

/**
 * Send a GET request
 * @param path 	URL path from the endpoint
 */
export const get = (host: string, path: string): Promise<IncomingMessage> => {
	if (!path) {
		throw new Error("Argument \"path\" not specified")
	}
	else return requestWithOptions(host, path);
}

/**
 * Send a POST request
 * @param path 	URL path to the endpoint
 * @param body 	JSON string to send as body
 */
export const post = (host:string, path: string, body: string): Promise<IncomingMessage> => {
	if (!path) throw new Error("Argument \"path\" not specified")
	else if (!body) throw new Error("Argument \"body\" not specified")
	else return requestWithOptions(host, path, "POST", body);
}

/**
 * Send a PUT request
 * @param path 	URL path to the endpoint
 * @param body 	JSON string to send as body
 */
export const put = (host:string, path: string, body: string): Promise<IncomingMessage> => {
	if (!path) throw new Error("Argument \"path\" not specified")
	else if (!body) throw new Error("Argument \"body\" not specified")
	else return requestWithOptions(host, path, "PUT", body);
}

/**
 * Send a DELETE request
 * @param path 			URL path to the endpoint
 * @param identifier 	Identifier ID for the item to delete
 */
export const del = (host:string, path: string): Promise<IncomingMessage> => {
	if (!path) throw new Error("Argument \"path\" not specified")
	else return requestWithOptions(host, path, "DELETE");
}
