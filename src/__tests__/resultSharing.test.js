import React from "react";
import App from "../App";

import { render, fireEvent, findByText } from "@testing-library/react";
import "@testing-library/jest-dom";
import { uuidv5Maker } from "./../utils/uuid-config";
import { getURLSharedId } from "./../utils/getURLSharedId";

jest.mock("../utils/fetchDataFiles");
jest.mock("../firebase/firebase-setup");
jest.mock("./../utils/getURLSharedId");

getURLSharedId.mockImplementation(() => "f81789d2-8ecc-5d84-b2e8-986e69b7f5d4");

function searchAndEnter(input, searchterm) {
  fireEvent.input(input, { target: { value: searchterm } });
  fireEvent.keyDown(input, { key: "Enter", keyCode: 13 });
}

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

test("It grabs the uuid from the url and uses it to perform a search", async () => {
  const { findAllByText } = render(<App />);
  const testsFound = await findAllByText(/test/g);
  expect(testsFound.length).toBe(3);
});

test("It generates an id in the pop up when shared", async () => {
  const { findAllByText, getByPlaceholderText } = render(<App />);
  const input = getByPlaceholderText("input anagram");
  //Search for trump
  searchAndEnter(input, "trump");
  await findAllByText(/trump/i);
  const shareButton = document.querySelector(".share-icon");
  fireEvent.click(shareButton, { button: 1 });
  const id = uuidv5Maker("trump");
  let regex = new RegExp(id, "i");
  let shareScreen = await findAllByText(regex);
  expect(shareScreen.length).toBe(1);
});
