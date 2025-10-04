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

  it("renders children", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("renders an icon if provided", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    render(
      <Button icon={<span data-testid="icon">*</span>}>With Icon</Button>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies the correct variant class", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    render(<Button variant="secondary">Test</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("secondary");
  });

  it("calls onClick when clicked (if not disabled)", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled
      </Button>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("adds 'focused' class on focus if last interaction was keyboard", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(true);

    render(<Button>Focusable</Button>);
    const button = screen.getByRole("button");

    fireEvent.focus(button);
    expect(button).toHaveClass("focused");

    fireEvent.blur(button);
    expect(button).not.toHaveClass("focused");
  });

  it("does not add 'focused' class on focus if last interaction was not keyboard", () => {
    (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

    render(<Button>Focusable</Button>);
    const button = screen.getByRole("button");

    fireEvent.focus(button);
    expect(button).not.toHaveClass("focused");
  });
});