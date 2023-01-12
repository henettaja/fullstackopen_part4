import { IBlog } from '../models/blog';
import listHelper from '../utils/blog_helper';

const longListOfBlogs: IBlog[] = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
];

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);

  expect(result).toBe(1);
});

describe('total likes', function () {
  test('of empty list is zero', () => {
    const emptyListOfBlogs: IBlog[] = [];

    const result = listHelper.totalLikes(emptyListOfBlogs);

    expect(result).toBe(0);
  });

  test('when only one blog, equals the likes of that', () => {
    const listWithOneBlog: IBlog[] = [
      {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
      },
    ];

    const result = listHelper.totalLikes(listWithOneBlog);

    expect(result).toBe(listWithOneBlog[0].likes);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(longListOfBlogs);

    expect(result).toBe(36);
  });
});

describe('most likes', function () {
  test('of a list returns right value', () => {
    const result = listHelper.favoriteBlog(longListOfBlogs);

    expect(result).toEqual(longListOfBlogs[2]);
  });

});

describe('most blogs', function () {
  test('of a list returns right value', () => {
    const result = listHelper.favoriteBlog(longListOfBlogs);

    expect(result).toEqual(longListOfBlogs[2]);
  });
});
