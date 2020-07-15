import React from "react";
import App from "../App";
import { waitFor, render, fireEvent, getByText, findByText } from "@testing-library/react";
import "@testing-library/jest-dom";
import { v5 as uuidv5 } from "uuid";
import { uuidv5Maker } from './../utils/uuid-config';

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
    expect(await findAllByText(/donald/gi));
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
    await waitFor(() => { }, { timeout: 50 });
    expect(trumpResult[0].parentElement.parentElement).not.toHaveClass("--active");

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
    searchAndEnter(input, "trump");
    //wait for result
    let findDonald = await findAllByText(/trump/gi);
    expect(findDonald.length).toBe(3);

    //Search for test
    searchAndEnter(input, "test");
    //wait for result
    const testResult = await findAllByText(/test/gi);
    findDonald = await findAllByText(/trump/gi);

    console.log(testResult);
    expect(findDonald.length).toBe(1);
    expect(testResult.length).toBe(3);

    //Open the history toggle
    const expandHistoryToggle = document.querySelector(
      ".sider-container__icon-container__icon.history-icon"
    );
    fireEvent.click(expandHistoryToggle, { button: 1 });

    //Click on the trump history
    const trumpHistoryButton = document.querySelector(".result-0");
    fireEvent.click(trumpHistoryButton, { button: 1 });
    // await waitFor(() => {}, { timeout: 50 });

    const secondTestResult = await findAllByText("test");
    const trumpResult = await findAllByText(/trump/gi);
    //wait for result
    expect(secondTestResult.length).toBe(1);
    expect(trumpResult.length).toBe(3);
  });
});

test("It generates an id in the pop up when shared", async () => {
  const { getByText, getByPlaceholderText } = render(<App />);
  const input = getByPlaceholderText("input anagram");
  //Search for trump
  searchAndEnter(input, "trump");
  const shareButton = document.querySelector(".anticon-share-alt.share-icon");
  fireEvent.click(shareButton, { button: 1 });
  const id = uuidv5Maker("trump");
  let regex = new RegExp(id);
  let shareScreen = await findByText(regex);
  expect(shareScreen.length).toBe(1);
});
