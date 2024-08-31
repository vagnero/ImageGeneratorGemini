import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()
import { MeasureType } from '@prisma/client';
import Customer from '../models/Customer';
import { CustomerRepository } from './CustomerRepository';
import Measure from "../models/Measure";
import { DoubleReportException } from '../exceptions/DoubleReportException';

export class MeasureRepository{
    static async create(measure: Measure, customer: Customer): Promise<Measure>{
        const created = await prisma.measure.create({
            data:{
                measureUuid: measure.measureUuid,
                measureDatetime: measure.measureDatetime,
                measureType: measure.measureType || null,
                imageUrl: measure.imageUrl,
                measureValue: measure.measureValue,
                hasConfirmed: measure.hasConfirmed,
                customerId: customer.id
            }
          }
        )
        return created;
      }

    
      static async getExistingMeasure(measure: Measure, customer: Customer): Promise<Measure | null>{
        const customerFound = await CustomerRepository.get(customer.customer_code);
        const existingMeasure = await prisma.measure.findFirst({
          where: {
            customerId: customerFound?.id,
            measureType: measure.measureType,
          },
        });
        return existingMeasure;

      }

      static async getByUuid(measure_uuid: string): Promise<Measure | null>{
        const existingMeasure = await prisma.measure.findFirst({
          where: {
            measureUuid: measure_uuid
          },
        });
        return existingMeasure;

      }

      static async measureByType(customer_code: string, measure_type?: string): Promise<Measure[] | null> {
        const existingCustomer = await prisma.customer.findFirst({
            where: {
                customer_code: customer_code
            }
        });
    
        if (!existingCustomer) {
            return null;
        }
    
        const filters: any = {
            customerId: existingCustomer.id,
        };
    
        if (measure_type) {
            filters.measureType = measure_type.toUpperCase() as MeasureType;
        }
    
        const measures = await prisma.measure.findMany({
            where: filters,
        });
    
        return measures.length ? measures : null;
    }

    static async findByCustomerCode(customerCode: string, measureType?: string) {
      try {
          const query: any = {
              where: {
                  customerCode: customerCode,
              },
          };

          if (measureType) {
              query.where.measureType = measureType;
          }

          const measures = await prisma.measure.findMany(query);
          return measures;
      } catch (error) {
          console.error("Error fetching measures:", error);
          throw error;
      }
  }
      
      static async updateConfirmedValue(measure_uuid: string, confirmed_value: number): Promise<void> {
        await prisma.measure.update({
          where: {
            measureUuid: measure_uuid
          },
          data: {
            measureValue: confirmed_value,
            hasConfirmed: true
          },
        });
      }


    

}
