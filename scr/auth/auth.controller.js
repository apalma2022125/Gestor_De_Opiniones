import bcryptjs from 'bcryptjs';
import User from '../users/users.model.js';
import { generarJWT } from '../helpers/generate-jwt.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        msg: "Incorrect credentials, does not exist in database",
      });
    }
    if (!user.estado) {
      return res.status(400).json({
        msg: "The user does not exist in the database",
      });
    }
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "The password is incorrect        ",
      });
    }
    const token = await generarJWT( user.id);

    res.status(200).json({
      msg: 'Login Ok!!!',
      user,
      token
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      msg: "Contact the administrator      ",
    });
  }
}