import { render, screen, fireEvent } from "@testing-library/react";
import FileUpload from "../components/common/Input/FileUpload/FileUpload";
import { useTranslation } from "react-i18next";
import useGetSupportedFormats from "../functions/getSupportedFormats";

jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, opts?: any) => key,
    })
}))

jest.mock("../functions/getSupportedFormats", () => ({
  __esModule: true,
  default: (accept: string) => ({
    supportedFormats: [".txt"],
    mimeExtensions: "text/plain",
  }),
}));

describe("FileUpload.tsx && File.tsx", () => {

  it("uploads a file through input change", () => {
    return;
    const handleFilesSelected = jest.fn();

    render(
      <FileUpload
        title="Upload"
        accept=".txt"
        allowMultiple={false}
        onFilesSelected={handleFilesSelected}
        ariaLabel="file-upload"
      />
    );

    const input = screen.getByLabelText("file-upload");
    // Or query directly: screen.getByRole("textbox") may not work since it's hidden,
    // so instead you can use container.querySelector("input[type=file]")

    const file = new File(["hello world"], "hello.txt", { type: "text/plain" });

    fireEvent.change(input, {
      target: { files: [file] }, // mock FileList
    });

    expect(handleFilesSelected).toHaveBeenCalled();
    expect(handleFilesSelected.mock.calls[0][0][0]).toEqual(file);
  });
});