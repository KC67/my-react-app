import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Transactions from "../../../pages/transactions/Transactions";

// 1. Mock useFetchData hook
vi.mock("../../../api/hooks/useFetchData");

// 2. Mock calculateRewardPoints
vi.mock("../../../utils/calculateRewardPoints", () => ({
  calculateRewardPoints: vi.fn(),
}));

// 3. Mock Table (so we can inspect props easily)
vi.mock("../../../components/common/table/Table", () => ({
  __esModule: true,
  default: ({ columns, data }) => (
    <div
      data-testid="table"
      data-columns={JSON.stringify(columns)}
      data-rows={JSON.stringify(data)}
    />
  ),
}));

// 4. Mock Loader
vi.mock("../../../components/common/loader/LoadingSpinner", () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

import useFetchData from "../../../api/hooks/useFetchData";
import { calculateRewardPoints } from "../../../utils/calculateRewardPoints";

describe("Transactions Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders heading", () => {
    useFetchData.mockReturnValue({ loading: false, data: [] });

    render(<Transactions />);

    expect(screen.getByText("Transactions")).toBeInTheDocument();
  });

  it("shows loader when loading = true", () => {
    useFetchData.mockReturnValue({ loading: true, data: [] });

    render(<Transactions />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
    expect(screen.queryByTestId("table")).not.toBeInTheDocument();
  });

  it("renders table with transformed transactions", () => {
    const mockApiData = [
      {
        transactionId: "T001",
        name: "Alice",
        date: "2025-01-10",
        product: "Mouse",
        price: 120,
      },
      {
        transactionId: "T002",
        name: "Bob",
        date: "2025-01-11",
        product: "Keyboard",
        price: 80,
      },
    ];

    // Mock reward points
    calculateRewardPoints.mockReturnValueOnce(90).mockReturnValueOnce(30);

    useFetchData.mockReturnValue({
      loading: false,
      data: mockApiData,
    });

    render(<Transactions />);

    const table = screen.getByTestId("table");
    const rows = JSON.parse(table.getAttribute("data-rows"));

    expect(rows).toEqual([
      {
        id: "T001",
        customerName: "Alice",
        date: "2025-01-10",
        product: "Mouse",
        price: 120,
        rewardPoints: 90,
      },
      {
        id: "T002",
        customerName: "Bob",
        date: "2025-01-11",
        product: "Keyboard",
        price: 80,
        rewardPoints: 30,
      },
    ]);
  });

  it("passes correct columns to Table", () => {
    useFetchData.mockReturnValue({ loading: false, data: [] });

    render(<Transactions />);

    const table = screen.getByTestId("table");

    const columns = JSON.parse(table.getAttribute("data-columns"));

    expect(columns).toEqual([
      { key: "id", label: "Transaction ID" },
      { key: "customerName", label: "Customer Name" },
      { key: "date", label: "Purchase Date" },
      { key: "product", label: "Product Purchased" },
      { key: "price", label: "Price" },
      { key: "rewardPoints", label: "Reward Points" },
    ]);
  });
});
