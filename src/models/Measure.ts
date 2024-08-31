import Customer from "./Customer";
import { MeasureType } from "@prisma/client";

  class Measure {
    measureUuid: string;
    measureDatetime: Date;
    measureType: MeasureType | null;
    imageUrl: string;
    measureValue: number;
    hasConfirmed: boolean;
    customerId: number;
  
    constructor(
      measureUuid: string,
      measureDatetime: Date,
      measureType: MeasureType,
      imageUrl: string,
      measureValue: number,
      hasConfirmed: boolean,
      customer: Customer
    ) {
      this.measureUuid = measureUuid;
      this.measureDatetime = measureDatetime;
      this.measureType = measureType;
      this.imageUrl = imageUrl;
      this.measureValue = measureValue;
      this.hasConfirmed = hasConfirmed;
      this.customerId = customer.id;
    }
  }  

export default Measure;