import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TotalRewards from "../../../pages/totalRewards/TotalRewards";

// Mock dependencies
vi.mock("../../../api/hooks/useFetchData");
vi.mock("../../../utils/calculateRewardPoints", () => ({
  calculateRewardPoints: vi.fn(),
}));

// Mock Table so we can inspect its props easily
vi.mock("../../../components/common/table/Table", () => ({
  default: ({ columns, data }) => (
    <div
      data-testid="table"
      data-columns={JSON.stringify(columns)}
      data-rows={JSON.stringify(data)}
    />
  ),
}));

// Mock Loader
vi.mock("../../../components/common/loader/LoadingSpinner", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

import useFetchData from "../../../api/hooks/useFetchData";
import { calculateRewardPoints } from "../../../utils/calculateRewardPoints";

describe("TotalRewards Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading", () => {
    useFetchData.mockReturnValue({ loading: false, data: [] });

    render(<TotalRewards />);

    expect(screen.getByText("Total Rewards")).toBeInTheDocument();
  });

  it("shows loader when loading = true", () => {
    useFetchData.mockReturnValue({ loading: true, data: [] });

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

    useFetchData.mockReturnValue({
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
    useFetchData.mockReturnValue({ loading: false, data: [] });

    render(<TotalRewards />);

    const table = screen.getByTestId("table");
    const columns = JSON.parse(table.getAttribute("data-columns"));

    expect(columns).toEqual([
      { key: "customerName", label: "Customer Name" },
      { key: "rewardPoints", label: "Reward Points" },
    ]);
  });
});
