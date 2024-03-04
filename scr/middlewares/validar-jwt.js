import jwt from 'jsonwebtoken'
import User from '../users/users.model.js'

export const validarJWT = async (req, res, next) => {
    const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "There isn't token in the request"
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const user = await User.findById(uid);

    if(!user){
      return res.status(401).json({
        msg: "The token has a user that don't exist en database, plis change it"
      })
    }

    if(!user.estado){
      return res.status(401).json({
        msg: "The token isn't valid - user with estado: false"
      })
    }

    req.user = user;

    next();
  } catch (e) {
    console.log(e),
      res.status(401).json({
        msg: "The token isn't valid",
      });
  }
}