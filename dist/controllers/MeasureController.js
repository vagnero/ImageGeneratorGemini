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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Customer_1 = __importDefault(require("../models/Customer"));
const CustomerService_1 = require("../services/CustomerService");
const Measure_1 = __importDefault(require("../models/Measure"));
const MeasureService_1 = require("../services/MeasureService");
const uuid_1 = require("uuid");
class MeasureController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { image, customer_code, measure_datetime, measure_type } = req.body;
                const customer = new Customer_1.default(customer_code);
                let value = yield MeasureService_1.MeasureService.generateImageValue(image);
                const guid = yield MeasureService_1.MeasureService.generateGuidImage(image);
                const measure = new Measure_1.default((0, uuid_1.v4)(), measure_datetime, measure_type, guid, value, false, customer);
                //Cria o cliente no banco de dados
                const createdCustomer = yield CustomerService_1.CustomerService.createCustomer(customer);
                const createdMeasure = yield MeasureService_1.MeasureService.createMeasure(measure, createdCustomer);
                return res.status(201).json(createdMeasure);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { measure_uuid, confirmed_value } = req.body;
                const response = yield MeasureService_1.MeasureService.confirmMeasure(measure_uuid, parseInt(confirmed_value, 10));
                console.log(response);
                return res.status(200).json(response);
            }
            catch (error) {
                return res.status(500).json(error);
            }
        });
    }
    getMeasures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { customer_code } = req.params; // Obtém o código do cliente dos parâmetros da URL
            const measureType = req.query.measure_type; // Obtém o tipo de medição dos parâmetros da query
            try {
                const result = yield MeasureService_1.MeasureService.listMeasures(customer_code, measureType);
                res.status(result.status_code).json(result);
            }
            catch (error) {
                res.status(500).json({
                    status_code: 500,
                    message: error,
                });
            }
        });
    }
}
exports.default = MeasureController;
