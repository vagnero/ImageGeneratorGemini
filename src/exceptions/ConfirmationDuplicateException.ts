export class ConfirmationDuplicateException extends Error {
    public statusCode: number;
    public errorCode: string;
    public errorDescription: string;
  
    constructor() {
      super("Leitura já confirmada");
      this.statusCode = 409;
      this.errorCode = "CONFIRMATION_DUPLICATE";
      this.errorDescription = "A leitura já foi confirmada anteriormente";
    }
  }