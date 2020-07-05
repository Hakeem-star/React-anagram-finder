import React from "react";
import App from "../App";
import { render, fireEvent } from "@testing-library/react";

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
    TRUMCDONALD6: [{ "Donald Trump": "100%" }],
  })
);

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe("<App />", () => {
  test("renders without crashing", () => {
    render(<App />);
  });

  test("Displays a results table when a result is found", async () => {
    const { findAllByText, getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("input anagram");
    // input.value = "trump";
    fireEvent.input(input, { target: { value: "trump" } });
    fireEvent.keyPress(input, { key: "Enter", code: 13, charCode: 13 });
    expect(await findAllByText(/TRUMP/i));
  });

  test("Displays 'Nothing was Found' when a result is not found", () => {
    // wrapper = mount(<App />);
    // wrapper.setState({ results: {} });
    // //console.log(toJson(wrapper.find(".ResultsPageNumber")));
    // const nothingFound = wrapper.find("h4");
    // expect(nothingFound.text()).toBe("Nothing was found!");
  });
});
