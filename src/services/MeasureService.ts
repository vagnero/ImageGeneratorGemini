import { MeasureRepository } from "../repositories/MeasureRepository";
import { imageCache } from "../cache/imageCache";
import Customer from "../models/Customer";
import Measure from "../models/Measure";
import { DoubleReportException } from "../exceptions/DoubleReportException";
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from '@google/generative-ai';
require('dotenv').config();
import path from 'path';
import { InvalidDataException } from "../exceptions/InvalidDataException";
import { MeasureNotFoundException } from "../exceptions/MeasureNotFoundException";
import { ConfirmationDuplicateException } from "../exceptions/ConfirmationDuplicateException";


const port = process.env.PORT;
const key = process.env.GEMINI_KEY || "faield";
const genAI = new GoogleGenerativeAI(key);
const fileManager = new GoogleAIFileManager(key);
export class MeasureService {

    static async createMeasure(measure: Measure, customer: Customer): Promise<Measure | null> {
        try {
            // Verifica se já existe uma medida para o mesmo cliente e tipo de leitura
            const existingMeasure = await MeasureRepository.getExistingMeasure(measure, customer);
            
            // Se existe uma medida e o mês é o mesmo, lançar exceção
            console.log("Existe uma medida")
            if (existingMeasure) {
              // Converter as datas para objetos Date
              const existingMeasureDate = new Date(existingMeasure.measureDatetime);
              const measureDate = new Date(measure.measureDatetime);
            
              // Comparar mês e ano das duas datas
              const sameMonth = existingMeasureDate.getMonth() === measureDate.getMonth() &&
                                existingMeasureDate.getFullYear() === measureDate.getFullYear();
              
              if (sameMonth) {
                throw new DoubleReportException(); // Lança uma exceção se já houver uma leitura no mês atual
              }
            }
      
            // Caso não haja duplicação, criar nova medida
            return await MeasureRepository.create(measure, customer);
      
          } catch (error) {
            // Repassar a exceção para ser tratada por quem chamou o método
            console.log(error);
            throw error;
          }
    }

       // Adicione o método para listar medidas
       static async listMeasures(customerCode: string, measureType?: string): Promise<any> {
        try {
            // Valida se o tipo de medição é válido, se fornecido
            if (measureType) {
                const validTypes = ["WATER", "GAS"];
                if (!validTypes.includes(measureType.toUpperCase())) {
                }
            }

            // Filtra medidas do cliente pelo código e tipo opcional
            const measures = await MeasureRepository.findByCustomerCode(customerCode, measureType ? measureType.toUpperCase() : undefined);

            return {
                status_code: 200,
                data: measures,
            };
        } catch (error) {
            // Trata erros e os retorna
            console.error(error);
            throw error;
        }
    }

    static async generateGuidImage(base64str: string): Promise<string>{
        try {
            const buf = Buffer.from(base64str, 'base64');;
        
            // Gera um UUID para o link temporário
            const imageId = uuidv4();
            imageCache.set(imageId, buf);
            // Armazena a imagem no cache
        
            // Define um tempo de expiração para a imagem (por exemplo, 5 minutos)
            setTimeout(() => {
              imageCache.delete(imageId);
            }, 50 * 60 * 1000); // 5 minutos
        
            // Retorna o link temporário
           
            return `http://localhost:${port}/image/${imageId}`
          } catch (error) {
            console.log(error);
            return 'faield';
          }
    }

    static async generateImageValue(base64str: string): Promise<Number>{
        
        try {
      
            const model = genAI.getGenerativeModel({
              // Escolha um modelo do Gemini.
              model: "gemini-1.5-pro",
            });
        
              // Converte o valor base64 em um buffer de imagem
              const buffer = Buffer.from(base64str, 'base64');
      
              // Gera uma imagem com uma data
              const tempImagePath = path.resolve(__dirname, '../assets/temp_image_' + Date.now() + '.jpg');
              fs.writeFileSync(tempImagePath, buffer);
          
              // Faz o upload da imagem para a API do Google Gemini
              const uploadResponse = await fileManager.uploadFile(tempImagePath, {
                mimeType: "image/jpeg",
                displayName: "Uploaded image",
              });
          
              // Remove o arquivo temporário após o upload
              //fs.unlinkSync(tempImagePath);
      
              // Gera o conteúdo baseado na imagem enviada
              const result = await model.generateContent([
                {
                  fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                  },
                },
                { text: "Me dê o valor da medição que está nesse medidor" },
              ]);
          
              const responseText = await result.response.text();
      
              console.log(responseText);
      
              // Expressão regular para encontrar o primeiro número na resposta
              const match = responseText.match(/\d+/);
              if (match) {
                  return parseInt(match[0], 10);
              } else {
                  console.error('Nenhum número encontrado na resposta.');
                  return -1;
              }
            } catch (error) {
              console.error('Error generating content:', error);
              return -1;
            }
          }

          static async confirmMeasure(measure_uuid: string, confirmed_value: number): Promise<any> {
      
            try {
              // Verifica se a leitura (measure) existe
              const existingMeasure = await MeasureRepository.getByUuid(measure_uuid);
              if (!existingMeasure) {
                throw new MeasureNotFoundException();
              }
        
              // Verifica se a leitura já foi confirmada
              if (existingMeasure.hasConfirmed) {
                throw new ConfirmationDuplicateException();
              }
                
              console.log("success")
              // Retorna sucesso
                 // Atualiza a leitura com o valor confirmado
              await MeasureRepository.updateConfirmedValue(measure_uuid, confirmed_value);
              return {
                status_code: 200,
                success: true,
              };
        
            } catch (error) {
              // Tratamento de erros personalizados
              if (error instanceof InvalidDataException) {
                return {
                  status_code: 400,
                  error_code: error.errorCode,
                  error_description: error.errorDescription,
                };
              } else if (error instanceof MeasureNotFoundException) {
                return {
                  status_code: 404,
                  error_code: error.errorCode,
                  error_description: error.errorDescription,
                };
              } else if (error instanceof ConfirmationDuplicateException) {
                return {
                  status_code: 409,
                  error_code: error.errorCode,
                  error_description: error.errorDescription,
                };
              }
        
              // Se for outro tipo de erro, re-lança para ser tratado por outros middlewares ou log
              throw error;
            }
          }

         

  }