export class InvalidDataException extends Error {
    public statusCode: number;
    public errorCode: string;
    public errorDescription: string;
  
    constructor(message: string) {
      super(message);
      this.statusCode = 400;
      this.errorCode = "INVALID_DATA";
      this.errorDescription = message;
    }
  }
  