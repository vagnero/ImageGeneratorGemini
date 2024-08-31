import {PrismaClient} from '@prisma/client'
const prisma = new PrismaClient()
import { MeasureType } from '@prisma/client';
import Customer from '../models/Customer';

import Measure from "../models/Measure";

export class CustomerRepository{
    static async create(customer: Customer): Promise<Customer>{
        const created = await prisma.customer.create({
            data:{
                customer_code: customer.customer_code
            }
          }
        )
        return created;
      }
    static async get(code: string): Promise<Customer | null>{
        const getCustomer = await prisma.customer.findUnique({
            where:{
                customer_code: code
            }
        })
        return getCustomer
    }

    
    
}
