import * as chai from "chai";
const expect = chai.expect;

import {isBrowser} from "./utils";

describe("Utils", () => {
    describe("isBrowser client", () => {
        before(function() {
            global.window = {};
        });
        it("client", done => {
            expect(isBrowser()).to.equal(true);
            done();
        });
    });
    describe("isBrowser server", () => {
        before(function() {
            global.window = undefined;
        });
        it("server", done => {
            expect(isBrowser()).to.equal(false);
            done();
        });
    });
});
