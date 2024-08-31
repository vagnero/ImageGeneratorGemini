import { Prisma } from "@prisma/client";
import Customer from "../models/Customer";
import { CustomerRepository } from "../repositories/CustomerRepository";

export class CustomerService {

    //Método que retorna um cliente mesmo ocorrendo o erro de unique
    static async createCustomer(customer: Customer): Promise<Customer> {
      try {
        // Tenta criar o cliente
        return await CustomerRepository.create(customer);
      } catch (error) {
        // Captura o erro de unicidade
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          // Busca o cliente existente pelo código
          const existingCustomer = await CustomerRepository.get(customer.customer_code);
          
          // Se encontrar, retorna o cliente existente
          if (existingCustomer) {
            return existingCustomer;
          }
        }
        // Lança o erro original se não for erro de unicidade
        throw error;
      }
    }
    
    }
