import { model, ObjectId, Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser {
  username: string;
  name: string;
  passwordHash?: string;
  password?: string;
  blogs: ObjectId[];
}

const userSchema = new Schema<IUser>({
  username: { type: 'string', required: true, unique: true, minLength: 3 },
  name: { type: 'string', required: true },
  passwordHash:  { type: 'string', required: true },
  blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }]
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
