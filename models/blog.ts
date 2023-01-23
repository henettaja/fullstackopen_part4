import { model, Schema } from 'mongoose';

export interface IBlog {
  title: string;
  author: string;
  url: string;
  likes: number
}

const blogSchema = new Schema<IBlog>({
  title: { type: 'string', required: true },
  author: { type: 'string' },
  url: { type: 'string', required: true },
  likes: { type: 'number', required: true }
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export const Blog = model('Blog', blogSchema);
