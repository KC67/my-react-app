import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";
import TotalRewards from "../../pages/totalRewards/TotalRewards";
import { calculateRewardPoints } from "../../utils/calculateRewardPoints";

// Mock dependencies
vi.mock("../../api/transactionDetailsData", () => ({
  useFetchTransactionDetailsData: vi.fn(),
}));
vi.mock("../../utils/calculateRewardPoints", () => ({
  calculateRewardPoints: vi.fn(),
}));

// Mock Table so we can inspect its props easily
vi.mock("../../components/table/Table", () => ({
  default: ({ columns, data }) => (
    <div
      data-testid="table"
      data-columns={JSON.stringify(columns)}
      data-rows={JSON.stringify(data)}
    />
  ),
}));

// Mock Loader
vi.mock("../../components/loader/LoadingSpinner", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe("TotalRewards Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading", () => {
    useFetchTransactionDetailsData.mockReturnValue({
      loading: false,
      data: [],
    });

    render(<TotalRewards />);

    expect(screen.getByText("Total Rewards")).toBeInTheDocument();
  });

  it("shows loader when loading = true", () => {
    useFetchTransactionDetailsData.mockReturnValue({ loading: true, data: [] });

    render(<TotalRewards />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByTestId("table")).not.toBeInTheDocument();
  });

  it("renders table with merged reward points", () => {
    const mockApiData = [
      { name: "Alice", price: 120 },
      { name: "Bob", price: 80 },
      { name: "Alice", price: 60 },
    ];

    // Mock reward calculations
    calculateRewardPoints
      .mockReturnValueOnce(90) // Alice 120
      .mockReturnValueOnce(30) // Bob 80
      .mockReturnValueOnce(10); // Alice 60

    useFetchTransactionDetailsData.mockReturnValue({
      loading: false,
      data: mockApiData,
    });

    render(<TotalRewards />);

    const table = screen.getByTestId("table");
    const rows = JSON.parse(table.getAttribute("data-rows"));

    expect(rows).toEqual([
      { customerName: "Alice", rewardPoints: 100 },
      { customerName: "Bob", rewardPoints: 30 },
    ]);
  });

  it("passes correct columns to Table", () => {
    useFetchTransactionDetailsData.mockReturnValue({
      loading: false,
      data: [],
    });

    render(<TotalRewards />);

    const table = screen.getByTestId("table");
    const columns = JSON.parse(table.getAttribute("data-columns"));

    expect(columns).toEqual([
      { key: "customerName", label: "Customer Name" },
      { key: "rewardPoints", label: "Reward Points" },
    ]);
  });
});
