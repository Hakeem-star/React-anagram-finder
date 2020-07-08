import React from "react";
import App from "../App";
import { waitFor, render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

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

// jest.mock("../utils/celebAnagramFinderAPICall");

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
    fireEvent.input(input, { target: { value: "trump" } });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    expect(await findAllByText(/donald/gi));
  });

  test("Displays 'No results found' when a result is not found", async () => {
    const { findAllByText, getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("input anagram");
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    expect(await findAllByText(/found/gi));
  });
});
