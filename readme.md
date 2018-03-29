# Creating HTTPS requests in Node.js

## The why
Creating [HTTP](https://nodejs.org/api/http.html#http_http_request_options_callback)/[HTTPS](https://nodejs.org/api/https.html)(I'll refer to them as HTTPS requests, but the same principle applies to HTTP) calls in Node.js is said to be hard, there is a whole bunch of things you have to keep track of, like proper closing, the result being a stream, error handling.  
And why would you do this anyway? You can just as easily install a module like [request](https://www.npmjs.com/package/request), or maybe one like [got](https://github.com/sindresorhus/got), that doesn't have as much dependencies.  
Hating oneself might be a good start, add in some curiosity and a tendency to understand everything yourself, and you've got yourself a proper challenge! This might also teach me something more about streams, proper error handling and other things I hadn't thought of yet. And if it turns out to be too much of an issue, I can always plug into one of the already existing libraries!

## The how
As it turns out, it's not that hard to make an HTTPS request, once you get the hang of it. It's just more convenient and straightforward to use a library.  
[I have written a bit about the main issues I've found here](#The-issues).
### The GET
Setting up a basic `GET` request is described [here][walsh].
```typescript
import { request } from "https";

let body:string = "";
const req = request({
  host: "someHost",
  path: "somePath"
}, res => {
    res.on("data", chunk => body += chunk)
    .on("end", () => {
      console.log("response has been received:");
      console.log(body);
    })
}).on("error", err => {
    console.error(err);
}).end();
```
In this example we're sending a get request to `someHost/somePath`. The request function defaults to `GET` so there is no need to set the method. Our response `res` is an `IncommingMessage` object, which works like a stream (I think).
The body of your responses will be send to you in chunks of data, that is where the `res.on("data", chunk => body += chunk)` comes in. Since the data will be received in order, just add your `chunk` to the `body` string.
When the stream is done sending you information you will receive an end command, in the form of `res.on("end")`. In out example we'll just print the body, but you can do anything with your data now!  
Just to make sure that your program won't break we'll add our `req.on("error")` part. This part catches your error and lets you do something with it, instead of just breaking your program.  
And the last part might just be the most important part of this little piece. If you forget to add `req.end()` the server you're sending this to will never know when the stream is ending, and since you're not sending anything this will result in a time-out error. (This little bit of missing code gave me quite the headache)
### The POST
Now that we've got our basic `GET` request working, lets move to our `POST`. (The same structure works for `PUT` and `DELETE`)
```typescript
import { request } from "https";

const requestBody = {
  "some": 1,
  "json": 2,
  "to": [1,2,3],
  "send": "to your host"
}

let responseBody:string = "";
const req = request({
  host: "someHost",
  path: "somePath",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(requestBody)
  },
  auth: "<fancyUsername>:<passablePassword>"
}, res => {
    res.on("data", chunk => responseBody += chunk)
    .on("end", () => {
      console.log("response has been received:");
      console.log(responseBody);
    })
}).on("error", err => {
    console.error(err);
}).end(requestBody);
```
As you can see this code looks similar to the `GET` request, only has a few extra options to keep in mind.
The request parameters have been updated to
```typescript
host: "someHost",
path: "somePath",
method: "POST",
headers: {
  "Content-Type": "application/json",
  "Content-Length": Buffer.byteLength(requestBody)
},
auth: "<fancyUsername>:<passablePassword>"
```
Since we'll be doing a `POST`, this is what our `method` needs to be set to.
We'll also be sending our `requestBody` object, and the server needs to know what to expect. That is why we're sending `"Content-Type": "application/json"` and `"Content-Length": Buffer.byteLength(requestBody)` headers. This is to let the server know that we're sending a json file with it's length. Because streams work with bytes, the length needs to be set to `byteLength`.  
Because we're doing a `POST` we'll probably need to provide some authentication, that is what the `auth` part is for. This uses BASE authentication, automatically adding BASE64 encoding. for BASE auth the username and password need to be separated by `:`.  
The rest of the function is almost the same, except for the end of the request. This is where we'll pass the `requestBody` to our call by adding it as a parameter in `req.end(requestBody);`. There might be more fancy ways with `req.write()`, but this caused me [some errors](#The-issues).

And that's how you do requests without the need for external libraries.

## The issues
The first issue was a `req.end()` call, or the lack thereof. If you do not include this call somewhere in your code your request will never be closed and you WILL get a `socket hang up` error.  
The second issue was adding a body to a `POST` or `PUT` request with `req.write()`. This caused TypeScript to freak out and throw some errors. I managed to solve this by adding the body to `req.end(body)`.  
The last thing I managed to mess up several times was adding a `/` before a path, I created a checker function that adds the `/` if you forget to do it yourself in the end, but beware!


[walsh]:https://davidwalsh.name/nodejs-http-request
