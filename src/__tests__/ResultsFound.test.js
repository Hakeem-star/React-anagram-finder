import React from "react";
import ResultsFound from "../ResultsFound";
import toJson from "enzyme-to-json";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

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

describe("<ResultsFound />", () => {
  let wrapper;

  it("matches the snapshot", () => {
    wrapper = mount(<ResultsFound results={resultsProps} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("lets <ResultsPageNumber/> navigate pages properly", () => {
    wrapper = mount(<ResultsFound results={resultsProps} />);
    const next = wrapper.find(".next");
    next.simulate("click", { target: { textContent: " » " } });
    expect(wrapper.state("currentResultsPage")).toBe(1);
    const previous = wrapper.find(".previous");
    previous.simulate("click", { target: { textContent: " « " } });
    expect(wrapper.state("currentResultsPage")).toBe(0);
  });
});
