import mongoose from 'mongoose';

const UsersSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  email: {
    type: String,
    required: [true, "The email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: true,
  }
});

UsersSchema.methods.toJSON = function(){
  const { __v, password, _id, ...users} = this.toObject();
  users.user_id = _id;
  return users;
}

export default mongoose.model('User', UsersSchema);