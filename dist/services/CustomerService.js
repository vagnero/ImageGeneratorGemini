"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const client_1 = require("@prisma/client");
const CustomerRepository_1 = require("../repositories/CustomerRepository");
class CustomerService {
    //Método que retorna um cliente mesmo ocorrendo o erro de unique
    static createCustomer(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Tenta criar o cliente
                return yield CustomerRepository_1.CustomerRepository.create(customer);
            }
            catch (error) {
                // Captura o erro de unicidade
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                    // Busca o cliente existente pelo código
                    const existingCustomer = yield CustomerRepository_1.CustomerRepository.get(customer.customer_code);
                    // Se encontrar, retorna o cliente existente
                    if (existingCustomer) {
                        return existingCustomer;
                    }
                }
                // Lança o erro original se não for erro de unicidade
                throw error;
            }
        });
    }
}
exports.CustomerService = CustomerService;
