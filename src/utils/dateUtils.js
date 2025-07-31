function formatDate(date) {
  if (!date) return null;

  if (typeof date === "string") {
    if (isValidDateString(date)) {
      return date;
    }

    date = new Date(date);
  }

  if (date instanceof Date && !isNaN(date)) {
    return date.toISOString().split("T")[0];
  }

  return null;
}

function getCurrentDate() {
  return new Date().toISOString().split("T")[0];
}

function isValidDateString(dateString) {
  if (!dateString || typeof dateString !== "string") return false;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) return false;

  const date = new Date(dateString);
  return (
    date instanceof Date &&
    !isNaN(date) &&
    date.toISOString().split("T")[0] === dateString
  );
}

function parseOrCurrentDate(dateString) {
  if (!dateString) {
    return getCurrentDate();
  }

  if (isValidDateString(dateString)) {
    return dateString;
  }

  return getCurrentDate();
}

function isValidDateRange(from, to) {
  if (!isValidDateString(from) || !isValidDateString(to)) return false;

  return new Date(from) <= new Date(to);
}

module.exports = {
  formatDate,
  getCurrentDate,
  isValidDateString,
  parseOrCurrentDate,
  isValidDateRange,
};
