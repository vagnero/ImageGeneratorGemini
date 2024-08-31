export class DoubleReportException extends Error {
    public statusCode: number;
    public errorCode: string;
    public errorDescription: string;
  
    constructor() {
      super("Leitura do mês já realizada");
      this.statusCode = 409; // Exemplo de status HTTP para erro de requisição
      this.errorCode = "DOUBLE_REPORT";
      this.errorDescription = "Leitura do mês já realizada";
    }
  
    toJSON() {
      return {
        status_code: this.statusCode,
        error_code: this.errorCode,
        error_description: this.errorDescription,
      };
    }
  }