import { capitalize } from "@mui/material";

export const tranformHeaders = (headers = {}) => {
  const newHeaders = [];
  Object.keys(headers).forEach((header) => {
    newHeaders.push({
      id: header,
      label: capitalize(header.replace(/_/g, "")),
      numeric: header === "trips",
    });
  });
  return newHeaders;
};

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};
