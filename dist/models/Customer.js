"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Customer {
    constructor(customer_code, id) {
        this.customer_code = customer_code;
        this.id = id !== null && id !== void 0 ? id : 0; // Inicializa com 0 ou outro valor padrão
        this.measures = []; // Inicializar como uma lista vazia por padrão
    }
}
exports.default = Customer;
