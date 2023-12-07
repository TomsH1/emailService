import { Router } from 'express';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';

const routes = Router();

//store email template path and store the emailTemplate in templateContent
const templatePath = '../templates/email-template.html';
const templateContent = fs.readFileSync(path.resolve(__dirname, templatePath), 'utf-8');

// create a function to replace placeholders in the email template with received data
const replacePlaceholders = (html: string, data: { [x: string]: any; hasOwnProperty: (arg0: string) => any }): string =>{
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const placeholder = `{{${key}}}`;
            html = html.replace(new RegExp(placeholder, 'g'), data[key]);
        }
    }
    return html; 
}

routes.post('/sendEmail', async (req, res)  =>{
    const resend = new Resend(process.env.RESEND_API_KEY);
    const {name, subject, email, message} = req.body;
    const emailHtml = replacePlaceholders(templateContent, {name, subject, email, message});

    if(!name || !subject || !email || !message){
      return res.status(400).send({'Error': 'Bad Request some fiels are empty'})
    }

    try {
      const sendEmail = await resend.emails.send({
        from: name+' <'+ process.env.EMAIL_API_MANAGER+'>',
        to: ['tomashdez777@gmail.com' ,'tomashdez1080@gmail.com'],
        subject: 'Un cliente ha visto tu portafolio', 
        html: emailHtml,
      });
      if(sendEmail.data == null){
        return res.status(500).send({'Error': 'no content return'})
      }
      return res.status(200).send(sendEmail);
      
    } catch (error) {
      console.error(error);
      return res.status(500).send({'Error': 'Internal server error \n'+error})
    }
  })

export default routes;
