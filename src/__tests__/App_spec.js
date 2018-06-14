import * as React from "react";
const ReactShallowRenderer = require("react-test-renderer/shallow");
const ReactTestRenderer = require("react-test-renderer");

import App from "../App";

describe("<App />", () => {
    it("renders", () => {
        const tree = ReactTestRenderer.create(<App />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
