import { Router } from 'express';
import { check } from 'express-validator';


import{existingEmail, existUserById} from '../helpers/db-validator.js';
import {validarCampos} from '../middlewares/validar-campos.js';