"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const routes = (0, express_1.Router)();
dotenv_1.default.config();
//store email template path and store the emailTemplate in templateContent
const templatePath = '../templates/email-template.html';
const templateContent = fs_1.default.readFileSync(path_1.default.resolve(__dirname, templatePath), 'utf-8');
// create a function to replace placeholders in the email template with received data
const replacePlaceholders = (html, data) => {
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const placeholder = `{{${key}}}`;
            html = html.replace(new RegExp(placeholder, 'g'), data[key]);
        }
    }
    return html;
};
routes.post('/sendEmail', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
    const { name, subject, email, message } = req.body;
    const emailHtml = replacePlaceholders(templateContent, { name, subject, email, message });
    if (!name || !subject || !email || !message) {
        return res.status(400).send({ 'Error': 'Bad Request some fiels are empty' });
    }
    try {
        const sendEmail = yield resend.emails.send({
            from: `${name} <${process.env.EMAIL_API_MANAGER}>`,
            to: process.env.DESTINATIONS_EMAIL.split(','),
            text: `${subject}\n ${message} \n ${email}`,
            subject: `Un cliente ha visto tu portafolio`,
            html: emailHtml,
        });
        if (sendEmail.data == null) {
            return res.status(500).send({ 'Error': 'no content return' });
        }
        return res.status(200).send(sendEmail);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ 'Error': 'Internal server error' });
    }
}));
exports.default = routes;
