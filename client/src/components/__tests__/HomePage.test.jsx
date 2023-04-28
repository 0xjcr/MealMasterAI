import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "../../pages/HomePage";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import Profile from "../Profile";
import { vi } from "vitest";

describe("HomePage buttons", () => {
  test("HomePage should render two buttons", () => {
    render(
      <HomePage>
        <button />
        <button />
      </HomePage>,
      { wrapper: BrowserRouter }
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
