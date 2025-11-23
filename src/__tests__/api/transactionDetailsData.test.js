import { renderHook } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { useFetchTransactionDetailsData } from "../../api/transactionDetailsData";

// Mock useFetchData
import useFetchData from "../../hooks/useFetchData";
vi.mock("../../hooks/useFetchData");

describe("useFetchTransactionDetailsData (Vitest)", () => {
  const mockToday = new Date("2025-11-15");

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockToday);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("filters last 3 months and sorts descending", () => {
    useFetchData.mockReturnValue({
      loading: false,
      data: [
        { transactionId: "T1", date: "2025-11-10", price: 120 },
        { transactionId: "T2", date: "2025-10-15", price: 130 },
        { transactionId: "T3", date: "2025-09-20", price: 90 },
        { transactionId: "T4", date: "2025-08-25", price: 110 }, // old
      ],
    });

    const { result } = renderHook(() => useFetchTransactionDetailsData());

    expect(result.current.loading).toBe(false);
    expect(result.current.data.map((x) => x.transactionId)).toEqual([
      "T1",
      "T2",
      "T3",
    ]);
  });

  it("ignores invalid dates", () => {
    useFetchData.mockReturnValue({
      loading: false,
      data: [
        { transactionId: "T1", date: "invalid", price: 100 },
        { transactionId: "T2", date: "2025-11-01", price: 150 },
      ],
    });

    const { result } = renderHook(() => useFetchTransactionDetailsData());

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].transactionId).toBe("T2");
  });

  it("for invalid data", () => {
    useFetchData.mockReturnValue({
      loading: false,
      data: { transactionId: "T1", date: "invalid", price: 100 },
    });

    const { result } = renderHook(() => useFetchTransactionDetailsData());

    expect(result.current.data).toHaveLength(0);
  });
});
