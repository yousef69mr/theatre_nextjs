
interface FormattedBigInt {
  value: string;
  unit: string;
}

export const formatBigInt = (value: string): FormattedBigInt => {
  const units = ["thousand", "million", "billion", "trillion", "quadrillion"];

  // Parse the string into a bigint
  const bigValue = BigInt(value);

  // Calculate the appropriate unit
  const magnitude = Math.floor((value.length - 1) / 3);
  if (magnitude > 0) {
    const unitIndex = Math.min(magnitude - 1, units.length - 1);
    const unit = units[unitIndex];
    const divisor = BigInt(10) ** BigInt(unitIndex * 3);
    const formattedValue = (bigValue / divisor).toString();
    return { value: formattedValue, unit };
  }

  return { value: value, unit: "" };
};


