import React from "react";
import App from "../App";
import { waitFor, render, fireEvent } from "@testing-library/react";
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

function searchAndEnter(input, searchterm) {
  fireEvent.input(input, { target: { value: searchterm } });
  fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
}

describe("<App />", () => {
  test("renders without crashing", () => {
    render(<App />);
  });

  test("Displays a results table when a result is found", async () => {
    const { findAllByText, getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("input anagram");
    fireEvent.input(input, { target: { value: "trump" } });
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    expect(await findAllByText(/donald/i));
  });

  test("It highlights a historical search item when a previous search is repeated ", async () => {
    const { findAllByText, getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("input anagram");

    searchAndEnter(input, "trump//");
    await findAllByText("trump//");
    searchAndEnter(input, "test");
    await findAllByText("test");
    searchAndEnter(input, "trump//");
    const trumpResult = await findAllByText("trump//");
    expect(trumpResult[0].parentElement.parentElement).toHaveClass("--active");
    searchAndEnter(input, "test");
    await waitFor(() => {}, { timeout: 50 });
    expect(trumpResult[0].parentElement.parentElement).not.toHaveClass(
      "--active"
    );
  });

  test("Displays 'No results found' when a result is not found", async () => {
    const { findAllByText, getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("input anagram");
    fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
    expect(await findAllByText(/No results found/i));
  });

  test("clicking on previous history searches for historical anagram", async () => {
    const { findAllByText, getByPlaceholderText } = render(<App />);
    const input = getByPlaceholderText("input anagram");
    //Input element is not included in findby results, so visible counts will be 1 less

    //Search for trump
    searchAndEnter(input, "trump");
    //wait for result
    let findDonald = await findAllByText(/trump/i);
    expect(findDonald.length).toBe(3);

    //Search for test
    searchAndEnter(input, "test");
    //wait for result
    const testResult = await findAllByText(/test/i);
    findDonald = await findAllByText(/trump/i);
    //Trump from history still visible
    expect(findDonald.length).toBe(1);

    expect(testResult.length).toBe(3);

    //Open the history toggle
    const expandHistoryToggle = document.querySelector(
      ".sider-container__icon-container__icon.history-icon"
    );
    fireEvent.click(expandHistoryToggle, { button: 1 });

    //Click on the trump history
    const trumpHistoryButton = document.querySelector(".result-0 button");
    fireEvent.click(trumpHistoryButton, { button: 1 });

    const secondTestResult = await findAllByText("test");
    const trumpResult = await findAllByText(/trump/i);
    //wait for result
    // expect(secondTestResult.length).toBe(1);
    expect(trumpResult.length).toBe(3);
  });
});
