"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
require('dotenv').config();
const port = process.env.PORT;
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
const MeasureRoutes_1 = __importDefault(require("./routes/MeasureRoutes"));
app.use(MeasureRoutes_1.default);
app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
});
