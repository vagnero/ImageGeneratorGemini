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
exports.CustomerRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CustomerRepository {
    static create(customer) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield prisma.customer.create({
                data: {
                    customer_code: customer.customer_code
                }
            });
            return created;
        });
    }
    static get(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const getCustomer = yield prisma.customer.findUnique({
                where: {
                    customer_code: code
                }
            });
            return getCustomer;
        });
    }
}
exports.CustomerRepository = CustomerRepository;
