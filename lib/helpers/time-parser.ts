export function convertDateTime(inputDateTime: string): string {
  // Create a Date object from the input datetime string
  const date = new Date(inputDateTime);

  // Extract the date and time components
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  // Assemble the formatted date string
  const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  return formattedDateTime;
}

export function convertDateFormat(inputDateTime: string): string {
  // Create a Date object from the input datetime string
  const date = new Date(inputDateTime);

  // Extract the date and time components
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");

  // Assemble the formatted date string
  const formattedDateTime = `${year}-${month}-${day}`;

  return formattedDateTime;
}


export const isDate = (value: string): boolean => {
  // Define a regular expression to match the date format YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Test the value against the regex and return true if it matches
  return dateRegex.test(value);
};

export const isDateTime = (value: string): boolean => {
  // Define a regular expression to match common date-time formats
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;

  // Test the value against the regex and return true if it matches
  return dateTimeRegex.test(value);
};