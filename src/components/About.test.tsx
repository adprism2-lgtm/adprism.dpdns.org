import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import About from "./About";

// framer-motion's useInView relies on IntersectionObserver, absent in jsdom.
beforeAll(() => {
  class IO {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  // @ts-expect-error test shim
  window.IntersectionObserver = IO;
  // @ts-expect-error test shim
  global.IntersectionObserver = IO;
});

describe("About stats", () => {
  it("renders each stat label with exact uppercase text and line breaks", () => {
    render(<About />);

    const cases = [
      "YEARS BEHIND\nTHE LENS",
      "PROJECTS\nDELIVERED",
      "HAPPY BRANDS & CLIENTS",
    ];

    for (const text of cases) {
      const el = screen.getByText((_content, node) => node?.textContent === text);
      expect(el).toBeInTheDocument();
      // Uppercase enforced regardless of CSS transforms.
      expect(el.textContent).toBe(text);
      expect(el.textContent).toBe(el.textContent?.toUpperCase());
    }
  });

  it("exposes the exact stat values via accessible labels for the counters", () => {
    render(<About />);
    for (const value of ["13+", "300+", "60+"]) {
      expect(screen.getByLabelText(value)).toBeInTheDocument();
    }
  });

  it("keeps two-line labels split on a newline character", () => {
    render(<About />);
    const twoLine = ["YEARS BEHIND\nTHE LENS", "PROJECTS\nDELIVERED"];
    for (const text of twoLine) {
      const el = screen.getByText((_content, node) => node?.textContent === text);
      expect(el.textContent?.split("\n")).toHaveLength(2);
    }
  });
});
