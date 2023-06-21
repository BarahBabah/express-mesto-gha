const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  CONFLICT: 409,
  FORBIDDEN: 403,
  NOT_AUTHORIZED: 401,
  DUBLICATE_KEY_ERROR: 11000,
};

// eslint-disable-next-line no-useless-escape
const patternUrl = /http(s)?:\/\/(www.)?[a-z0-9\.\-]+\/[a-z0-9\.\-_~:\/?#\[\]@!$&'()*+,;=]+/;

module.exports = { STATUS_CODES, patternUrl };
