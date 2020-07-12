import React from "react";
import App from "../App";
import { waitFor, render, fireEvent, getByText } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("../utils/fetchCelebData");

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

Object.defineProperty(window.HTMLElement.prototype, "scrollIntoView", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({})),
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

  test("It highlights a historical search item when a previous search is repeated ", async () => {
    const { findAllByText, getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("input anagram");
    function searchAndEnter(searchterm) {
      fireEvent.input(input, { target: { value: searchterm } });
      fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    }
    searchAndEnter("trump//");
    searchAndEnter("dennis");
    await waitFor(() => {}, { timeout: 50 });
    searchAndEnter("trump//");
    const result = await findAllByText("trump//");
    expect(result[0].parentElement).toHaveClass("--active");
  });

  test("Displays 'No results found' when a result is not found", async () => {
    const { findAllByText, getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("input anagram");
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    expect(await findAllByText(/No results found/gi));
  });

  test("clicking on previous history searches for historical anagram", async () => {
    const { findAllByText, getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("input anagram");
    //Search for trump
    fireEvent.input(input, { target: { value: "trump" } });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    //wait for result
    expect(await findAllByText(/donald/gi));
    //Search for test
    fireEvent.input(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    //wait for result
    const testResult = await findAllByText(/test/gi);
    expect(testResult.length).toBeGreaterThan(5);

    //Open the history toggle
    const expandHistoryToggle = document.querySelector(
      ".sider-container__history-icon-container__icon"
    );
    fireEvent.click(expandHistoryToggle, { button: 1 });

    //Click on the trump history
    const trumpHistoryButton = document.querySelector(".result-0");
    fireEvent.click(trumpHistoryButton, { button: 1 });
    // await waitFor(() => {}, { timeout: 50 });

    const secondTestResult = await findAllByText("test");
    const trumpResult = await findAllByText(/trump/gi);
    //wait for result
    expect(secondTestResult.length).toBeLessThan(5);
    expect(trumpResult.length).toBeGreaterThan(10);
  });
});

test("It generates an id in the url when shared", () => {
  const { getByText, getByPlaceholderText } = render(<App />);
  const input = getByPlaceholderText("input anagram");
  //Search for trump
  fireEvent.input(input, { target: { value: "trump" } });
  fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });

  const shareButton = document.querySelector(".anticon-share-alt.share-icon");
  fireEvent.click(shareButton, { button: 1 });
});
