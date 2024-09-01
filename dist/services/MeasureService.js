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
exports.MeasureService = void 0;
const MeasureRepository_1 = require("../repositories/MeasureRepository");
const imageCache_1 = require("../cache/imageCache");
const DoubleReportException_1 = require("../exceptions/DoubleReportException");
const uuid_1 = require("uuid");
const fs = require('fs');
const server_1 = require("@google/generative-ai/server");
const generative_ai_1 = require("@google/generative-ai");
require('dotenv').config();
const path_1 = __importDefault(require("path"));
const InvalidDataException_1 = require("../exceptions/InvalidDataException");
const MeasureNotFoundException_1 = require("../exceptions/MeasureNotFoundException");
const ConfirmationDuplicateException_1 = require("../exceptions/ConfirmationDuplicateException");
const tempImageDir = path_1.default.resolve(__dirname, '../assets');
if (!fs.existsSync(tempImageDir)) {
    fs.mkdirSync(tempImageDir, { recursive: true });
}
const port = process.env.PORT;
const key = process.env.GEMINI_KEY || "faield";
const genAI = new generative_ai_1.GoogleGenerativeAI(key);
const fileManager = new server_1.GoogleAIFileManager(key);
class MeasureService {
    static createMeasure(measure, customer) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verifica se já existe uma medida para o mesmo cliente e tipo de leitura
                const existingMeasure = yield MeasureRepository_1.MeasureRepository.getExistingMeasure(measure, customer);
                // Se existe uma medida e o mês é o mesmo, lançar exceção
                console.log("Existe uma medida");
                if (existingMeasure) {
                    // Converter as datas para objetos Date
                    const existingMeasureDate = new Date(existingMeasure.measureDatetime);
                    const measureDate = new Date(measure.measureDatetime);
                    // Comparar mês e ano das duas datas
                    const sameMonth = existingMeasureDate.getMonth() === measureDate.getMonth() &&
                        existingMeasureDate.getFullYear() === measureDate.getFullYear();
                    if (sameMonth) {
                        throw new DoubleReportException_1.DoubleReportException(); // Lança uma exceção se já houver uma leitura no mês atual
                    }
                }
                // Caso não haja duplicação, criar nova medida
                return yield MeasureRepository_1.MeasureRepository.create(measure, customer);
            }
            catch (error) {
                // Repassar a exceção para ser tratada por quem chamou o método
                console.log(error);
                throw error;
            }
        });
    }
    // Adicione o método para listar medidas
    static listMeasures(customerCode, measureType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Valida se o tipo de medição é válido, se fornecido
                if (measureType) {
                    const validTypes = ["WATER", "GAS"];
                    if (!validTypes.includes(measureType.toUpperCase())) {
                        throw new Error(`Invalid measure type: ${measureType}`);
                    }
                }
                // Filtra medidas do cliente pelo código e tipo opcional
                const measures = yield MeasureRepository_1.MeasureRepository.findByCustomerCode(customerCode, measureType ? measureType.toUpperCase() : undefined);
                return {
                    status_code: 200,
                    data: measures,
                };
            }
            catch (error) {
                // Trata erros e os retorna
                console.error(error);
                return {
                    status_code: 500,
                    message: error,
                };
            }
        });
    }
    static generateGuidImage(base64str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buf = Buffer.from(base64str, 'base64');
                ;
                // Gera um UUID para o link temporário
                const imageId = (0, uuid_1.v4)();
                imageCache_1.imageCache.set(imageId, buf);
                // Armazena a imagem no cache
                // Define um tempo de expiração para a imagem (por exemplo, 5 minutos)
                setTimeout(() => {
                    imageCache_1.imageCache.delete(imageId);
                }, 50 * 60 * 1000); // 5 minutos
                // Retorna o link temporário
                return `http://localhost:${port}/image/${imageId}`;
            }
            catch (error) {
                console.log(error);
                return 'faield';
            }
        });
    }
    static generateImageValue(base64str) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const model = genAI.getGenerativeModel({
                    // Escolha um modelo do Gemini.
                    model: "gemini-1.5-pro",
                });
                // Converte o valor base64 em um buffer de imagem
                const buffer = Buffer.from(base64str, 'base64');
                if (buffer.length === 0) {
                    throw new Error('O buffer gerado está vazio');
                }
                // Gera uma imagem com uma data
                const tempImagePath = path_1.default.join(tempImageDir, 'temp_image_' + Date.now() + '.jpg');
                yield fs.promises.writeFile(tempImagePath, buffer);
                console.log('Buffer size:', buffer.length);
                //Faz o upload da imagem para a API do Google Gemini
                const uploadResponse = yield fileManager.uploadFile(tempImagePath, {
                    mimeType: "image/jpeg",
                    displayName: "Uploaded image",
                });
                //Remove o arquivo temporário após o upload
                fs.unlinkSync(tempImagePath);
                //Gera o conteúdo baseado na imagem enviada
                const result = yield model.generateContent([
                    {
                        fileData: {
                            mimeType: uploadResponse.file.mimeType,
                            fileUri: uploadResponse.file.uri,
                        },
                    },
                    { text: "Me dê o valor da medição que está nesse medidor" },
                ]);
                const responseText = yield result.response.text();
                console.log(responseText);
                // Expressão regular para encontrar o primeiro número na resposta
                const match = responseText.match(/\d+/);
                if (match) {
                    return parseInt(match[0], 10);
                }
                else {
                    console.error('Nenhum número encontrado na resposta.');
                    return -1;
                }
            }
            catch (error) {
                console.error('Error generating content:', error);
                return -1;
            }
        });
    }
    static confirmMeasure(measure_uuid, confirmed_value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verifica se a leitura (measure) existe
                const existingMeasure = yield MeasureRepository_1.MeasureRepository.getByUuid(measure_uuid);
                if (!existingMeasure) {
                    throw new MeasureNotFoundException_1.MeasureNotFoundException();
                }
                // Verifica se a leitura já foi confirmada
                if (existingMeasure.hasConfirmed) {
                    throw new ConfirmationDuplicateException_1.ConfirmationDuplicateException();
                }
                console.log("success");
                // Retorna sucesso
                // Atualiza a leitura com o valor confirmado
                yield MeasureRepository_1.MeasureRepository.updateConfirmedValue(measure_uuid, confirmed_value);
                return {
                    status_code: 200,
                    success: true,
                };
            }
            catch (error) {
                // Tratamento de erros personalizados
                if (error instanceof InvalidDataException_1.InvalidDataException) {
                    return {
                        status_code: 400,
                        error_code: error.errorCode,
                        error_description: error.errorDescription,
                    };
                }
                else if (error instanceof MeasureNotFoundException_1.MeasureNotFoundException) {
                    return {
                        status_code: 404,
                        error_code: error.errorCode,
                        error_description: error.errorDescription,
                    };
                }
                else if (error instanceof ConfirmationDuplicateException_1.ConfirmationDuplicateException) {
                    return {
                        status_code: 409,
                        error_code: error.errorCode,
                        error_description: error.errorDescription,
                    };
                }
                // Se for outro tipo de erro, re-lança para ser tratado por outros middlewares ou log
                throw error;
            }
        });
    }
}
exports.MeasureService = MeasureService;
