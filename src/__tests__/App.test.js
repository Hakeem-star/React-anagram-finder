import React from "react";
import App from "../App";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import renderer from "react-test-renderer";
Enzyme.configure({ adapter: new Adapter() });

let resultsProps = JSON.parse(
  JSON.stringify({
    THANKSMO: [{ "Tom Hanks": "100%" }],
    TRUMCDONALD: [{ "Donald Trump": "100%" }],
    THANKSMO2: [{ "Tom Hanks": "100%" }],
    TRUMCDONALD2: [{ "Donald Trump": "100%" }],
    THANKSMO3: [{ "Tom Hanks": "100%" }],
    TRUMCDONALD3: [{ "Donald Trump": "100%" }],
    THANKSMO4: [{ "Tom Hanks": "100%" }],
    TRUMCDONALD4: [{ "Donald Trump": "100%" }],
    THANKSMO5: [{ "Tom Hanks": "100%" }],
    TRUMCDONALD5: [{ "Donald Trump": "100%" }],
    THANKSMO6: [{ "Tom Hanks": "100%" }],
    TRUMCDONALD6: [{ "Donald Trump": "100%" }]
  })
);

describe("<App />", () => {
  let wrapper;
  it("renders without crashing", () => {
    wrapper = mount(<App />);
  });

  it("matches the snapshot", () => {
    const component = renderer.create(<App />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("Displays a results table when a result is found", () => {
    wrapper = mount(<App />);
    wrapper.setState({ results: resultsProps });
    //console.log(toJson(wrapper.find(".ResultsPageNumber")));
    const ResultsPageNumber = wrapper.find(".ResultsPageNumber");
    expect(ResultsPageNumber).toHaveLength(1);
  });

  it("Displays 'Nothing was Found' when a result is not found", () => {
    wrapper = mount(<App />);
    wrapper.setState({ results: {} });
    //console.log(toJson(wrapper.find(".ResultsPageNumber")));
    const nothingFound = wrapper.find("h4");
    expect(nothingFound.text()).toBe("Nothing was found!");
  });
});
