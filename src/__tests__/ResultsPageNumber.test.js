import React from "react";
import { ResultsPageNumber } from "../ResultsFound";
import renderer from "react-test-renderer";

describe("<ResultsPageNumber />", () => {
  it("matches the snapshot", () => {
    const component = renderer.create(<ResultsPageNumber />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
