import { model, Schema, ObjectId } from 'mongoose';

export interface IBlog {
  title: string;
  author: string;
  url: string;
  likes: number
  id?: string;
  user: ObjectId;
}

const blogSchema = new Schema<IBlog>({
  title: { type: 'string', required: true },
  author: { type: 'string' },
  url: { type: 'string', required: true },
  likes: { type: 'number', required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Blog = model('Blog', blogSchema);

export default Blog;
