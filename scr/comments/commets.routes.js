import { Router } from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { PubliNoExists, commentNoExists } from "../helpers/db-validators.js";
import {
    getUserComments,
    createComment,
    updateComment,
    deleteComment
} from "./comment.controller.js";

const router = Router();

router.get(
    "/",
    [
        validarJWT
    ],
    getUserComments
);

router.post(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID for Publications").isMongoId(),
        check("id").custom(PubliNoExists),
        check("text", "Text is required").not().isEmpty(),
        validarCampos
    ],
    createComment
);

router.put(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID").isMongoId(),
        check("id").custom(commentNoExists),
        check("text", "Text is required").not().isEmpty(),
        validarCampos
    ],
    updateComment
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id", "Invalid ID").isMongoId(),
        check("id").custom(commentNoExists),
    ],
    deleteComment
);

export default router;
