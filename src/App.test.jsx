import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "./App.jsx";

test("renders home page text", () => {
  render(<App />);
  expect(screen.getByTestId("submit-button")).toBeInTheDocument();
});
