export class MeasureNotFoundException extends Error {
    public statusCode: number;
    public errorCode: string;
    public errorDescription: string;
  
    constructor() {
      super("Leitura não encontrada");
      this.statusCode = 404;
      this.errorCode = "MEASURE_NOT_FOUND";
      this.errorDescription = "Nenhuma leitura encontrada para o UUID fornecido";
    }
  }
  