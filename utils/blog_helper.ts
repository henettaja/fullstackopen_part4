import { IBlog } from '../models/blog';

const dummy = (blogs) => {
  return blogs ? 1 : 1;
};

const totalLikes = (blogs: IBlog[]): number => {
  let likes = 0;
  blogs.forEach((blog) => {
    likes += blog.likes;
  });
  return likes;
};

const favoriteBlog = (blogs: IBlog[]): IBlog => {
  return blogs.reduce((previousValue, currentValue) => {
    return previousValue.likes < currentValue.likes ? currentValue : previousValue;
  });
};

export default {
  dummy, totalLikes, favoriteBlog
};
