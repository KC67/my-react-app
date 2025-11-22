import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import UserMonthlyRewards from "../../pages/userMonthlyRewards/UserMonthlyRewards";
import { calculateMonthwiseRewards } from "../../utils/calculateMonthwiseRewards";

// Mock dependencies
vi.mock("../../api/transactionDetailsData", () => ({
  useFetchTransactionDetailsData: vi.fn(),
}));

// mock util function
vi.mock("../../utils/calculateMonthwiseRewards", () => ({
  calculateMonthwiseRewards: vi.fn(),
}));

// mock child components
vi.mock("../../components/loader/LoadingSpinner", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

vi.mock("../../components/table/Table", () => ({
  default: ({ columns, data }) => (
    <table data-testid="data-table">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

describe("UserMonthlyRewards Component", () => {
  it("shows loading spinner when loading=true", () => {
    useFetchTransactionDetailsData.mockReturnValue({
      data: [],
      loading: true,
    });

    render(<UserMonthlyRewards />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders table after data is loaded", () => {
    const fakeApiData = [
      { customerId: 1, name: "John", date: "2024-05-01", price: 120 },
      { customerId: 1, name: "John", date: "2024-05-20", price: 90 },
    ];

    const fakeMonthlyRewards = [
      {
        customerId: 1,
        name: "John",
        month: "May",
        year: 2024,
        rewardPoints: 150,
      },
    ];

    useFetchTransactionDetailsData.mockReturnValue({
      data: fakeApiData,
      loading: false,
    });

    calculateMonthwiseRewards.mockReturnValue(fakeMonthlyRewards);

    render(<UserMonthlyRewards />);

    // Table should appear
    const table = screen.getByTestId("data-table");
    expect(table).toBeInTheDocument();

    // Column headers
    expect(screen.getByText("Customer Id")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Month")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("Reward Points")).toBeInTheDocument();

    // Data rows
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("May")).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });
});
