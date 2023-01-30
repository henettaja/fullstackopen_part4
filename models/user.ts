import { model, Schema } from 'mongoose';
import { uniqueValidator } from 'mongoose-unique-validator';

export interface IUser {
  username: { type: 'string', required: true, unique: true },
  name: { type: 'string', required: true },
  passwordHash: { type: 'string', required: true }
}

const userSchema = new Schema<IUser>({
  username: String,
  name: String,
  passwordHash: String
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
