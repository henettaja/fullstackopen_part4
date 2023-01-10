import { model, Schema } from 'mongoose';

interface IBlog {
  title: string;
  author: string;
  url: string;
  likes: number
}

const blogSchema = new Schema<IBlog>({
  title: String,
  author: String,
  url: String,
  likes: Number
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export const Blog = model('Blog', blogSchema);
