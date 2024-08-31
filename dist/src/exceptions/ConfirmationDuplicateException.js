"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmationDuplicateException = void 0;
class ConfirmationDuplicateException extends Error {
    constructor() {
        super("Leitura já confirmada");
        this.statusCode = 409;
        this.errorCode = "CONFIRMATION_DUPLICATE";
        this.errorDescription = "A leitura já foi confirmada anteriormente";
    }
}
exports.ConfirmationDuplicateException = ConfirmationDuplicateException;
