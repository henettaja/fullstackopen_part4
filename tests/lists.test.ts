import { IBlog } from '../models/blog';
import blogHelper from '../utils/blog_helper';
import { IAuthor } from '../models/author';
import { longListOfBlogs } from '../utils/blog_helper';

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
