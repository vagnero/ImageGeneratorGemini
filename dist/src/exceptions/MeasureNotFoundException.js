"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasureNotFoundException = void 0;
class MeasureNotFoundException extends Error {
    constructor() {
        super("Leitura não encontrada");
        this.statusCode = 404;
        this.errorCode = "MEASURE_NOT_FOUND";
        this.errorDescription = "Nenhuma leitura encontrada para o UUID fornecido";
    }
}
exports.MeasureNotFoundException = MeasureNotFoundException;
