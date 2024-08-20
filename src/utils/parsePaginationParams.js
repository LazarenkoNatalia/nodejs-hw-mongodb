const parseNumber = (number, defaultValue) => {
  if (typeof number !== 'string') return defaultValue;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  console.log(page, perPage);
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);
 console.log(parsedPage, parsedPerPage);
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
