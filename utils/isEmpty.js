const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === 'objects' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;
