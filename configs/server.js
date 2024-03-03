'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import userRoutes from '../scr/users/users.routes.js';
import authRoutes from '../scr/auth/auth.routes.js';
import publicationRoutes from '../scr/publications/publications.routes.js';
import commentRoutes from '../scr/comments/commets.routes.js';


class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/OpinionApi/v1/users';
        this.authPath = '/OpinionApi/v1/auth';
        this.publicationPath = '/OpinionApi/v1/publication';
        this.commentPath = '/OpinionApi/v1/comment';

        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.userPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.publicationPath, publicationRoutes);
        this.app.use(this.commentPath, commentRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;