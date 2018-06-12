import * as React from "react";
const ReactShallowRenderer = require("react-test-renderer/shallow");
const ReactTestRenderer = require("react-test-renderer");

import IssueItem from "../IssueItem";

describe("<IssueItem />", () => {
    it("renders", () => {
        const tree = ReactTestRenderer.create(<IssueItem />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders with title", () => {
        const tree = ReactTestRenderer.create(<IssueItem title={"Hello"} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
    it("renders shallow", () => {
        const renderer = new ReactShallowRenderer();
        renderer.render(<IssueItem />);
        const result = renderer.getRenderOutput();
        expect(result.type).toBe("li");
    });
});
