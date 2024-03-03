import { Router } from 'express';
import { check } from 'express-validator';

import { validarCampos } from '../middlwares/validar-campos.js';
import { validarJWT } from '../middlwares/validar-jwt.js';

import { 
    publicationPost,
    publicationsGet,
    publicationPut,
    publicationDelete } from './publications.controller.js';

const router = Router();

router.post(
    '/',
    [
        validarJWT,
        check("title", "The title is required").not().isEmpty(),
        check("category", "The category is required").not().isEmpty(),
        check("text", "The principal text is required").not().isEmpty(),
        validarCampos
    ], publicationPost);

router.get('/', validarJWT, publicationsGet);

router.put(
    "/:id",
    [
        validarJWT,
        check('id', 'This is not a valid id').isMongoId(),
        validarCampos
    ],
    publicationPut
);

router.put(
    "/:id",
    [
        validarJWT,
        check('id', 'This is not a valid id').isMongoId(),
        validarCampos
    ],
    publicationPut
);

router.delete(
    "/:id",
    [
        validarJWT,
        check('id', 'This is not a valid id').isMongoId(),
        validarCampos
    ],
    publicationDelete
);

export default router;