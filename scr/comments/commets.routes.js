import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";



import {
    commentsGet,
    commentPut,
    commentDelete,
    commentPost
} from "./comments.controller.js";

const router = Router();

router.get(
    "/",commentsGet);

router.post(
    "/:Publications",
    [
        validarJWT,
        check("Publications", "Invalid ID for Publications").isMongoId(),
        check("commentText","The comment is required").not().isEmpty(),
        validarCampos
    ],commentPost);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID").isMongoId(),
        validarCampos
    ],commentPut);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID").isMongoId(),
    ],commentDelete);

export default router;
 