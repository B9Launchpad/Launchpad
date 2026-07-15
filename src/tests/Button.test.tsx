import { render, screen, fireEvent } from "@testing-library/react";
import Button from "../components/common/Button";

// Mock the custom hook useLastInteractionKeyboard
jest.mock("../functions/useLastInteractionKeyboard", () => ({
  __esModule: true,
  default: jest.fn(),
}));

import useLastInteractionKeyboard from "../functions/useLastInteractionKeyboard";

describe("Button component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders label", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    render(<Button label={"Click Me"}/>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("renders an icon if provided", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    render(
      <Button label={"With icon"} icon={<span data-testid="icon">*</span>}></Button>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies the correct variant class", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    render(<Button label="Test" variant="secondary"/>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("secondary");
  });

  it("calls onClick when clicked (if not disabled)", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    const handleClick = jest.fn();
    render(<Button label={"Click"} onClick={handleClick}/>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    const handleClick = jest.fn();
    render(
      <Button label={"Disabled"} onClick={handleClick} disabled/>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("adds 'focused' class on focus if last interaction was keyboard", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(true);

    render(<Button label="Focusable"/>);
    const button = screen.getByRole("button");

    fireEvent.focus(button);
    expect(button).toHaveClass("focused");

    fireEvent.blur(button);
    expect(button).not.toHaveClass("focused");
  });

  it("does not add 'focused' class on focus if last interaction was not keyboard", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    render(<Button label="Focusable"/>);
    const button = screen.getByRole("button");

    fireEvent.focus(button);
    expect(button).not.toHaveClass("focused");
  });
});