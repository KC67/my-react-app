import { describe, expect, it, vi } from "vitest";
import {
  apiURL,
  useFetchTransactionDetailsData,
} from "../../api/transactionDetailsData";
import useFetchData from "../../hooks/useFetchData";

// Mock the base hook
vi.mock("../../hooks/useFetchData", () => ({
  default: vi.fn(),
}));

describe("useFetchTransactionDetailsData", () => {
  it("calls useFetchData with correct API URL", () => {
    const mockReturn = { data: ["x"], loading: false };
    useFetchData.mockReturnValue(mockReturn);

    const result = useFetchTransactionDetailsData();

    expect(useFetchData).toHaveBeenCalledWith(apiURL);

    expect(result).toBe(mockReturn);
  });
});
