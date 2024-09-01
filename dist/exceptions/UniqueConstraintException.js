"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UniqueConstraintException extends Error {
    constructor(message, details) {
        super(message);
        this.name = 'UniqueConstraintException';
        this.statusCode = 400; // Exemplo de status HTTP para erro de requisição
        this.details = details || null;
    }
    toJson() {
        return {
            status: this.statusCode,
            error: this.name,
            message: this.message,
            details: this.details
        };
    }
}
exports.default = UniqueConstraintException;
