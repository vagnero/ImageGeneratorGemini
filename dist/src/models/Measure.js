"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Measure {
    constructor(measureUuid, measureDatetime, measureType, imageUrl, measureValue, hasConfirmed, customer) {
        this.measureUuid = measureUuid;
        this.measureDatetime = measureDatetime;
        this.measureType = measureType;
        this.imageUrl = imageUrl;
        this.measureValue = measureValue;
        this.hasConfirmed = hasConfirmed;
        this.customerId = customer.id;
    }
}
exports.default = Measure;
