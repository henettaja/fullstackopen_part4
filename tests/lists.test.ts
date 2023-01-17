import { IBlog } from '../models/blog';
import blogHelper from '../utils/blog_helper';
import { IAuthor } from '../models/author';
import { longListOfBlogs } from '../utils/blog_helper';

test('dummy returns one', () => {
  const blogs = [];

  const result = blogHelper.dummy(blogs);

  expect(result).toBe(1);
});

describe('total likes', function () {
  test('of empty list is zero', () => {
    const emptyListOfBlogs: IBlog[] = [];

    const result = blogHelper.totalLikes(emptyListOfBlogs);

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

    const result = blogHelper.totalLikes(listWithOneBlog);

    expect(result).toBe(listWithOneBlog[0].likes);
  });

  test('of a bigger list is calculated right', () => {
    const result = blogHelper.totalLikes(longListOfBlogs);

    expect(result).toBe(36);
  });
});

describe('most liked blog', function () {
  test('of a list of blogs returns right value', () => {
    const result = blogHelper.favoriteBlog(longListOfBlogs);
    const expectedBlog: IBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
    };

    expect(result).toEqual(expectedBlog);
  });

});

describe('most blogs from an author', function () {
  test('of a list of blogs returns right value', () => {
    const result = blogHelper.authorWithMostBlogs( longListOfBlogs);
    const expectedAuthor: IAuthor = { name: 'Robert C. Martin', amountOfBlogs: 3, amountOfLikes: 12 };

    expect(result).toEqual(expectedAuthor);
  });
});

describe('most liked author', function () {
  test('of a list of blogs returns right value', () => {
    const result = blogHelper.mostLikedAuthor(longListOfBlogs);
    const expectedAuthor: IAuthor = { name: 'Edsger W. Dijkstra', amountOfBlogs: 2, amountOfLikes: 17 };

    expect(result).toEqual(expectedAuthor);
  });
});
