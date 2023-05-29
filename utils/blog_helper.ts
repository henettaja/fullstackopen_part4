import { IDehydratedBlog } from '../models/blog';
import { IAuthor } from '../models/author';

export const longListOfBlogs: IDehydratedBlog[] = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'https://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
];

const dummy = (blogs) => {
  return blogs ? 1 : 1;
};

const totalLikes = (blogs: IDehydratedBlog[]): number => {
  let likes = 0;
  blogs.forEach((blog) => {
    likes += blog.likes;
  });
  return likes;
};

const favoriteBlog = (blogs: IDehydratedBlog[]): IDehydratedBlog => {
  return blogs.reduce((previousValue, currentValue) => {
    return previousValue.likes < currentValue.likes ? currentValue : previousValue;
  });
};

const getAuthorsFromListOfBlogs = (blogs: IDehydratedBlog[]): IAuthor[] => {
  const result = blogs.reduce((objectOfAuthors, { author, likes }) => {
    objectOfAuthors[author] ??= { name: author, amountOfBlogs: 0, amountOfLikes: 0 };
    objectOfAuthors[author].amountOfBlogs++;
    objectOfAuthors[author].amountOfLikes += likes;
    return objectOfAuthors;
  }, {} as Record<string, IAuthor>);
  return Object.values(result);
};

const authorWithMostBlogs = (blogs: IDehydratedBlog[]): IAuthor => {
  return getAuthorsFromListOfBlogs(blogs).reduce((prevous, current): IAuthor =>
    prevous.amountOfBlogs > current.amountOfBlogs ? prevous : current
  );
};

const mostLikedAuthor = (blogs: IDehydratedBlog[]) => {
  return getAuthorsFromListOfBlogs(blogs).reduce((previous, current) =>
    previous.amountOfLikes > current.amountOfLikes ? previous : current
  );
};


export default {
  dummy, totalLikes, favoriteBlog, amountOfBlogsByAuthor: getAuthorsFromListOfBlogs, authorWithMostBlogs, mostLikedAuthor
};
