import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClickOutsideListener from ".";

describe("click outside listener", () => {
  it("should render children", async () => {
    render(
      <ClickOutsideListener onClickOutside={jest.fn()}>
        Children
      </ClickOutsideListener>
    );

    expect(screen.getByText("Children")).toBeInTheDocument();
  });

  it("should trigger onClickOutside when clicked outside", () => {
    const mockFn = jest.fn();
    render(
      <div>
        <button>Click here</button>
        <ClickOutsideListener onClickOutside={mockFn}>
          Children
        </ClickOutsideListener>
      </div>
    );

    userEvent.click(screen.getByText("Click here"));
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it("should not trigger onClickOutside when clicked inside", () => {
    const mockFn = jest.fn();
    render(
      <ClickOutsideListener onClickOutside={mockFn}>
        <button>Click here</button>
      </ClickOutsideListener>
    );

    userEvent.click(screen.getByText("Click here"));
    expect(mockFn).not.toHaveBeenCalled();
  });
});
