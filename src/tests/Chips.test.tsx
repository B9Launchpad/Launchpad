import { render, screen, fireEvent, act } from "@testing-library/react";
import InputChips, { InputChipsRef } from "../components/common/Input/Chips";
import useLastInteractionKeyboard from "../functions/useLastInteractionKeyboard";
import { createRef } from "react";

jest.mock("../functions/useLastInteractionKeyboard", () => ({
    __esModule: true,
    default: jest.fn()
}));

describe("Chips input component ", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders children", () => {
        (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

        render(<InputChips type="string" required={false} label="Hello world">Put chips in</InputChips>);
        expect(screen.getByText("Put chips in")).toBeInTheDocument();
    })

    it("renders mandatory star", () => {
        (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

        render(<InputChips type="string" required={true} label="Hello world"></InputChips>);
        expect(screen.getByText("Hello world")).toBeInTheDocument();
        expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("updates input while typing", () => {
        (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

        render(<InputChips type="string" required label="Hello world"></InputChips>);
        const input = screen.getByRole("textbox");

        fireEvent.change(input, {target: {value: "Hello"}});
        expect(input).toHaveValue("Hello")
    })

    it("adds a chip when clicking + button", () => {
        (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

        render(<InputChips type="string" required label="Hello world"></InputChips>);
        const input = screen.getByRole("textbox");
        const button = screen.getByRole("button", {name: "+"});

        fireEvent.change(input, {target: { value: "chip"}});
        fireEvent.click(button);

        expect(screen.getByText("chip")).toBeInTheDocument();
    });

    it("adds a chip when pressing Enter", () => {
        (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

        render(<InputChips type="string" required label="Hello world"></InputChips>);
        const input = screen.getByRole("textbox");

        fireEvent.change(input, {target: {value: "chip"}});
        fireEvent.keyDown(input, { key: "Enter"});

        expect(screen.getByText("chip")).toBeInTheDocument();
    });

    it("removes a chip when bin icon clicked", () => {
        (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

        render(<InputChips label="Tags" required type={"string"} chips={["toRemove"]} />);
        const chip = screen.getByText("toRemove");

        fireEvent.click(screen.getByText("toRemove"));
        expect(chip).not.toBeInTheDocument();
    })

    it("applies validation and shows error message", () => {
        (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

        const validation = [(val: string) => val.length > 3, "Too short!"];
        render(<InputChips type="string" required label="Hello world" validation={validation as any}></InputChips>);

        const input = screen.getByRole("textbox");
        const button = screen.getByRole("button", {name: "+"});

        fireEvent.change(input, {target: { value: "ab"}});
        fireEvent.click(button);

        expect(screen.getByText("Too short!")).toBeInTheDocument();
    });

    it("accepts imperative handle: clear() and get()", () => {
        (useLastInteractionKeyboard as jest.Mock).mockReturnValue(false);

        const ref = createRef<InputChipsRef>();
        render(<InputChips type="string" required label="Hello world" ref={ref}/>);

        const input = screen.getByRole("textbox");
        const button = screen.getByRole("button", { name: "+" });

        fireEvent.change(input, { target: { value: "chip" } });
        fireEvent.click(button);

        expect(ref.current?.get()).toContain("chip");

        fireEvent.change(input, { target: { value: "chip1" } });
        act(() => {
            ref.current?.clear();
        });
        expect(input).toHaveValue("");
    });

    it("adds focus on keyboard focus", () => {
        (useLastInteractionKeyboard as jest.Mock).mockReturnValue(true);

        render(<InputChips type="string" required label="Hello world"/>);
        const input = screen.getByRole("textbox");

        fireEvent.focus(input);
        expect(input).toHaveClass("focused");

        fireEvent.blur(input);
        expect(input).not.toHaveClass("focused");
    })
})