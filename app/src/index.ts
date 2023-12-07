import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import emailServices from './routes/emailService'
const EMAIL_SERVER = express();

EMAIL_SERVER.set('port', process.env.PORT || 3200 );

//: Activar cabezera de peticiones de origen cruzado CORS y añadir rutas permitidas
EMAIL_SERVER.use(cors({
    origin: ['http://localhost:4200', 'https://tomsh1.github.io'],
    methods: 'POST',
    // allowedHeaders: ['Content-Type', 'Authorization'],
}));

//: Permitir solicitudes del tipo "preflights"
EMAIL_SERVER.options('*', cors());

EMAIL_SERVER.use((req, res, next) => {
    // console.log('Aplicando middleware cors');
    cors()(req, res, next);
});

EMAIL_SERVER.use(bodyParser.urlencoded({extended: false}));

EMAIL_SERVER.use(bodyParser.json());

EMAIL_SERVER.use('/', emailServices)

EMAIL_SERVER.listen(EMAIL_SERVER.get('port'), ()=>{
    console.log(`email server on in: ${EMAIL_SERVER.get('port')} 📩`)
})

export default EMAIL_SERVER;

/* Pero digamos que estoy trabajando en dos proyectos al mismo tiempo que usan versiones de node.js distintas, usar nvm install cambia la versión global y no local del proyecto, lo que hará que no pueda ejecutar los dos proyectos al mismo tiempo en las versiones que corresponden a cada uno. Ayudame con esto  */

