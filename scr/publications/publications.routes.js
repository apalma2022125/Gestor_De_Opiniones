import { Router } from "express";
import { check } from "express-validator";
import {
    publicationsGet,
    publicationPut,
    publicationDelete,
    publicationsPost
    } from "./publications.controller.js"
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { PubliNoExists} from "../helpers/db-validator.js";

const router = Router();

router.get(
    "/",
    validarJWT, publicationsGet);

router.post(
    "/",
    [
        validarJWT,
        check("title", "Title is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(),
        check("text", "Text is required").not().isEmpty(),
        validarCampos
    ],  publicationsPost
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID for Publications").isMongoId(),
        check("id").custom(PubliNoExists),
        check("title", "Title is required").not().isEmpty(),
        check("category", "Category is required").not().isEmpty(),
        check("text", "Text is required").not().isEmpty(),
    ],  publicationPut
)

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID for Publications").isMongoId(),
        check("id").custom(PubliNoExists),
    ],  publicationDelete
)

export default router;