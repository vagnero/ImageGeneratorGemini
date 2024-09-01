"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageCache_1 = require("../cache/imageCache");
const measureRouter = (0, express_1.Router)();
const MeasureController_1 = __importDefault(require("../controllers/MeasureController"));
const controller = new MeasureController_1.default();
measureRouter.post("/upload", controller.create);
measureRouter.patch("/confirm", controller.update);
measureRouter.get('/image/:id', (req, res) => {
    const imageId = req.params.id;
    const imageBuffer = imageCache_1.imageCache.get(imageId);
    if (imageBuffer) {
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': imageBuffer.length
        });
        res.end(imageBuffer);
    }
    else {
        res.status(404).json({ error: 'Imagem não encontrada ou expirada' });
    }
});
exports.default = measureRouter;
