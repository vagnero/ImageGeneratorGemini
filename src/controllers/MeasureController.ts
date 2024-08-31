import Customer from "../models/Customer";
import { CustomerService } from "../services/CustomerService";
import { Request, Response } from "express";
import Measure from "../models/Measure";
import { MeasureService } from "../services/MeasureService";
import { v4 as uuidv4 } from 'uuid';

export default class MeasureController{
    public async create(req: Request, res: Response):Promise<Response> {
        try {
            const {image, customer_code, measure_datetime, measure_type} = req.body;
            const customer = new Customer(customer_code);
            const value = (await MeasureService.generateImageValue(image)).valueOf();
            const guid = await MeasureService.generateGuidImage(image);
            const measure = new Measure(uuidv4(), measure_datetime, measure_type, guid, value, false, customer);
            
            //Cria o cliente no banco de dados
            const createdCustomer = await CustomerService.createCustomer(customer);

            const createdMeasure = await MeasureService.createMeasure(measure, createdCustomer);
            return res.status(201).json(createdMeasure)
        } catch (error) {
            return res.status(500).json(error)

        }


    }
    public async update(req: Request, res: Response):Promise<any> {
        try {
            const {measure_uuid, confirmed_value} = req.body
            const response = await MeasureService.confirmMeasure(measure_uuid, parseInt(confirmed_value,10));
            console.log(response)
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json(error);
        }
    }

}
