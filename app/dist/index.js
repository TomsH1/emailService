"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const emailService_1 = __importDefault(require("./routes/emailService"));
const EMAIL_SERVER = (0, express_1.default)();
EMAIL_SERVER.set('port', 3200 || process.env.PORT);
//: definir las cabeceras CORS
EMAIL_SERVER.use((0, cors_1.default)({
    origin: 'http://localhost:4200',
    methods: 'POST',
    // allowedHeaders: ['Content-Type', 'Authorization'],
}));
EMAIL_SERVER.use((req, res, next) => {
    // console.log('Aplicando middleware cors');
    (0, cors_1.default)()(req, res, next);
});
EMAIL_SERVER.use(body_parser_1.default.urlencoded({ extended: false }));
EMAIL_SERVER.use(body_parser_1.default.json());
EMAIL_SERVER.use('/', emailService_1.default);
EMAIL_SERVER.listen(EMAIL_SERVER.get('port'), () => {
    console.log(`email server on in: ${EMAIL_SERVER.get('port')} 📩`);
});
exports.default = EMAIL_SERVER;
/* Pero digamos que estoy trabajando en dos proyectos al mismo tiempo que usan versiones de node.js distintas, usar nvm install cambia la versión global y no local del proyecto, lo que hará que no pueda ejecutar los dos proyectos al mismo tiempo en las versiones que corresponden a cada uno. Ayudame con esto  */
