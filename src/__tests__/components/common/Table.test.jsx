import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Table from "../../../components/common/table/Table";

describe("Table Component", () => {
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
  ];

  const data = [
    { id: 1, name: "John" },
    { id: 2, name: "Alice" },
  ];

  it("renders table headers correctly", () => {
    render(<Table columns={columns} data={data} />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  it("renders table rows when data is provided", () => {
    render(<Table columns={columns} data={data} />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("shows 'No data available' when data is empty", () => {
    render(<Table columns={columns} data={[]} />);

    expect(screen.getByText("No data available")).toBeInTheDocument();
  });

  it("renders the correct number of rows", () => {
    render(<Table columns={columns} data={data} />);

    const rows = screen.getAllByRole("row");
    // 1 header row + 2 data rows = 3 rows
    expect(rows.length).toBe(3);
  });

  it("matches snapshot", () => {
    const { container } = render(<Table columns={columns} data={data} />);
    expect(container).toMatchSnapshot();
  });
});
