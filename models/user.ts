import { model, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser {
  username: string,
  name: string,
  passwordHash: string
}

const userSchema = new Schema<IUser>({
  username: { type: 'string', required: true, unique: true, minLength: 3 },
  name: { type: 'string', required: true },
  passwordHash:  { type: 'string', required: true }
});

userSchema.plugin(uniqueValidator);

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
