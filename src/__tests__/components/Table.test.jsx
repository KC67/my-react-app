import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Table from "../../components/table/Table";

describe("Table Component with Pagination", () => {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
  ];

  // 20 rows → 2 pages (12 on page 1, 8 on page 2)
  const data = Array.from({ length: 20 }).map((_, idx) => ({
    id: idx + 1,
    name: `User ${idx + 1}`,
  }));

  it("renders pagination controls", () => {
    render(<Table columns={columns} data={data} />);

    expect(screen.getByText("Prev")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  });

  it("disables Prev button on first page", () => {
    render(<Table columns={columns} data={data} />);

    expect(screen.getByText("Prev")).toBeDisabled();
    expect(screen.getByText("Next")).not.toBeDisabled();
  });

  it("navigates to next page on clicking Next", () => {
    render(<Table columns={columns} data={data} />);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Page indicator
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    // Page 2 should contain "User 13"
    expect(screen.getByText("User 13")).toBeInTheDocument();

    // Page 1 content should not be visible
    expect(screen.queryByText("User 1")).not.toBeInTheDocument();
  });

  it("navigates back to previous page on clicking Prev", () => {
    render(<Table columns={columns} data={data} />);

    // Move to page 2
    fireEvent.click(screen.getByText("Next"));

    // Now go back
    fireEvent.click(screen.getByText("Prev"));

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    // Page 1 row check
    expect(screen.getByText("User 1")).toBeInTheDocument();

    // Page 2 row should be gone
    expect(screen.queryByText("User 13")).not.toBeInTheDocument();
  });

  it("renders exactly 12 rows on page 1", () => {
    render(<Table columns={columns} data={data} />);

    // Row count includes header row
    const rows = screen.getAllByRole("row");
    // 12 data rows + 1 header row = 13 rows
    expect(rows.length).toBe(13);
  });

  it("renders correct rows on page 2", () => {
    render(<Table columns={columns} data={data} />);

    fireEvent.click(screen.getByText("Next"));

    // Only 8 rows on page 2 (20 - 12)
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBe(9); // 8 rows + 1 header

    // Validate last row
    expect(screen.getByText("User 20")).toBeInTheDocument();
  });

  it("renders correctly when there is no Data", () => {
    render(<Table columns={columns} data={[]} />);

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });
});
