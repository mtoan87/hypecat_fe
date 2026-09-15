import { useCallback } from "react";

export const usePriceFormatter = () => {
  const formatPrice = useCallback((value: number | string): string => {
    const numValue =
      typeof value === "string"
        ? parseInt(value.replace(/\D/g, ""), 10) || 0
        : value;
    return numValue.toLocaleString("vi-VN");
  }, []);

  const parsePrice = useCallback((value: string): number => {
    // Chỉ lấy số nguyên, bỏ hết ký tự không phải số
    const cleanValue = value.replace(/\D/g, "");
    return parseInt(cleanValue, 10) || 0;
  }, []);

  const createPriceChangeHandler = useCallback(
    (updateFunction: (value: number) => void) => {
      return (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = parsePrice(e.target.value);
        updateFunction(numericValue);
      };
    },
    [parsePrice]
  );

  return {
    formatPrice,
    parsePrice,
    createPriceChangeHandler,
  };
};
