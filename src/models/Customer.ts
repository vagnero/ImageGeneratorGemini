import Measure from "./Measure";

class Customer {
  id: number; // Pode ser opcional
  customer_code: string;
  measures?: Measure[];

  constructor(customer_code: string, id?: number) {
      this.customer_code = customer_code;
      this.id = id ?? 0; // Inicializa com 0 ou outro valor padrão
      this.measures = []; // Inicializar como uma lista vazia por padrão
  }
}

export default Customer