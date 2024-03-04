import { Router } from 'express';
import { check } from 'express-validator';


import{existingEmail, existingUserById} from '../helpers/db-validator.js';
import {validarCampos} from '../middlewares/validar-campos.js';


import {userGet, getUserbyId, userPut, usersPost}from './users.controller.js';


const router = Router();

router.get("/", userGet);

router.get(
    "/:id",
        [
            check("id","This id is not valid").isMongoId(),
            check("id").custom(existingUserById),
            validarCampos,
        ],getUserbyId);



router.put(
    "/:id",
        [
            check("id","This id is not valid").isMongoId(),
            check("id").custom(existingUserById),
            check("newPassword","The password must have min 6 charts").isLength({min:6}),
            validarCampos,
        ],userPut);        

router.post(
    "/",
    [
        check("nombre", "The name cannot be empty").not().isEmpty(),
        check("password", "The password cannot be empty").not().isEmpty(),
        check("password", "The password must have min 6 charts").isLength({min: 6}),
        check("email", "The email cannot be empty").not().isEmpty(),
        check("correo", "This email is invalid, plis write a corret email").isEmail(),
        check("email").custom(existingEmail),
     validarCampos,   
    ],usersPost);

    export default router;