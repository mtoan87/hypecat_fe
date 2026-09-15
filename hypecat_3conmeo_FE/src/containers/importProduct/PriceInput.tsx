import { TextField, InputAdornment } from "@mui/material";
import { useState, useEffect } from "react";
import { usePriceFormatter } from "../../hooks/useCustomCommasNumber";

interface PriceInputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  error?: boolean;
  helperText?: string;
}

const PriceInputField = ({
  label,
  value,
  onChange,
  error = false,
  helperText = "",
}: PriceInputFieldProps) => {
  const { formatPrice, parsePrice } = usePriceFormatter();
  const [rawInput, setRawInput] = useState<string>(formatPrice(value));

  useEffect(() => {
    setRawInput(formatPrice(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setRawInput(input);
    const numeric = parsePrice(input);
    onChange(numeric);
  };

  const handleBlur = () => {
    setRawInput(formatPrice(parsePrice(rawInput)));
  };

  return (
    <TextField
      label={label}
      size="small"
      value={rawInput}
      onChange={handleChange}
      onBlur={handleBlur}
      error={error}
      helperText={helperText}
      inputProps={{ inputMode: "numeric" }}
      InputProps={{
        endAdornment: <InputAdornment position="end">đ</InputAdornment>,
      }}
    />
  );
};

export default PriceInputField;
