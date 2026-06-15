import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "./App";

test("renders hello world message", () => {
  render(<App />);
  const linkElement = screen.getByText(/Hello world/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders header", () => {
  render(<App />);
  const headerElement = screen.getByText(/Urdu to English Live Interpreter/i);
  expect(headerElement).toBeInTheDocument();
});
