"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidDataException = void 0;
class InvalidDataException extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
        this.errorCode = "INVALID_DATA";
        this.errorDescription = message;
    }
}
exports.InvalidDataException = InvalidDataException;
