import test from "ava";
import { get, post, del } from "../https/requestConstructor";
import streamToJSON from "../streamToJson";

test("simple get request", t => {
    t.plan(1);
    return get("jsonplaceholder.typicode.com", "/posts/1")
    .then(res => {
        t.is(res.statusCode, 200);
    }).catch(err => t.fail("caught an unexpected error:\n" + err));
});
