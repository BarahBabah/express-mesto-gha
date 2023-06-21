/* eslint-disable max-classes-per-file */
const { STATUS_CODES } = require('./constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODES.NOT_FOUND;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODES.BAD_REQUEST;
  }
}

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODES.NOT_AUTHORIZED;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODES.FORBIDDEN;
  }
}
class ConflictUserError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = STATUS_CODES.CONFLICT;
  }
}

module.exports = {
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  ForbiddenError,
  ConflictUserError,
};
