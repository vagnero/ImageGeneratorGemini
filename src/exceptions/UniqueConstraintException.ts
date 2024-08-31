export default class UniqueConstraintException extends Error {
    public statusCode: number;
    public details: any;
  
    constructor(message: string, details?: any) {
      super(message);
      this.name = 'UniqueConstraintException';
      this.statusCode = 400; // Exemplo de status HTTP para erro de requisição
      this.details = details || null;
    }
  
    toJson() {
      return {
        status: this.statusCode,
        error: this.name,
        message: this.message,
        details: this.details
      };
    }
  }