import { model, Schema } from 'mongoose';

export interface IUser {
  username: { type: 'string', required: true },
  name: { type: 'string', required: true },
  passwordHash: { type: 'string', required: true }
}

const userSchema = new Schema<IUser>({
  username: String,
  name: String,
  passwordHash: String
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  }
});

const User = model('User', userSchema);

export default User;
