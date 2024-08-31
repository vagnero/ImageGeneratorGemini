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
exports.MeasureRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const CustomerRepository_1 = require("./CustomerRepository");
class MeasureRepository {
    static create(measure, customer) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield prisma.measure.create({
                data: {
                    measureUuid: measure.measureUuid,
                    measureDatetime: measure.measureDatetime,
                    measureType: measure.measureType || null,
                    imageUrl: measure.imageUrl,
                    measureValue: measure.measureValue,
                    hasConfirmed: measure.hasConfirmed,
                    customerId: customer.id
                }
            });
            return created;
        });
    }
    static getExistingMeasure(measure, customer) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerFound = yield CustomerRepository_1.CustomerRepository.get(customer.customer_code);
            const existingMeasure = yield prisma.measure.findFirst({
                where: {
                    customerId: customerFound === null || customerFound === void 0 ? void 0 : customerFound.id,
                    measureType: measure.measureType,
                },
            });
            return existingMeasure;
        });
    }
    static getByUuid(measure_uuid) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingMeasure = yield prisma.measure.findFirst({
                where: {
                    measureUuid: measure_uuid
                },
            });
            return existingMeasure;
        });
    }
    static measureByType(customer_code, measure_type) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCustomer = yield prisma.customer.findFirst({
                where: {
                    customer_code: customer_code
                }
            });
            if (!existingCustomer) {
                return null;
            }
            const filters = {
                customerId: existingCustomer.id,
            };
            if (measure_type) {
                filters.measureType = measure_type.toUpperCase();
            }
            const measures = yield prisma.measure.findMany({
                where: filters,
            });
            return measures.length ? measures : null;
        });
    }
    static findByCustomerCode(customerCode, measureType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = {
                    where: {
                        customerCode: customerCode,
                    },
                };
                if (measureType) {
                    query.where.measureType = measureType;
                }
                const measures = yield prisma.measure.findMany(query);
                return measures;
            }
            catch (error) {
                console.error("Error fetching measures:", error);
                throw error;
            }
        });
    }
    static updateConfirmedValue(measure_uuid, confirmed_value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.measure.update({
                where: {
                    measureUuid: measure_uuid
                },
                data: {
                    measureValue: confirmed_value,
                    hasConfirmed: true
                },
            });
        });
    }
}
exports.MeasureRepository = MeasureRepository;
