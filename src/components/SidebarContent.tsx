import { useState, useEffect } from "react";

interface Author {
  name: string;
  isFollowing: boolean;
  image: string;
}

const SidebarContent = () => {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://randomuser.me/api/?results=5");
        const data = await response.json();
        interface User {
          name: {
            first: string;
            last: string;
          };
          picture: {
            medium: string;
          };
        }

        const authorsData: Author[] = data.results.map((user: User) => ({
          name: `${user.name.first} ${user.name.last}`,
          isFollowing: false,
          image: user.picture.medium,
        }));
        setAuthors(authorsData);
      } catch (error) {
        console.error("Error fetching authors:", error);
      }
    };

    fetchData();
  }, []);

  const handleFollowClick = (index: number) => {
    setAuthors((prevAuthors) =>
      prevAuthors.map((author, i) =>
        i === index ? { ...author, isFollowing: !author.isFollowing } : author
      )
    );
  };

  const blogs = [
    {
      title: "Selling Hours",
      author: "Seth Godin",
      link: "https://seths.blog/2021/05/selling-hours",
    },
    {
      title: "My 31 Favorite Places to Visit in the USA",
      author: "Matt Kepnes (Nomadic Matt)",
      link: "https://www.nomadicmatt.com/travel-blogs/best-places-united-states",
    },
    {
      title: "Life is Poetry",
      author: "Leo Babauta (Zen Habits)",
      link: "https://zenhabits.net/life-is-poetry",
    },
  ];

  return (
    <div className="w-full max-w-xs mx-5 mt-20">
      {/* Top Sellers */}
      <div className="bg-white p-5 border rounded mb-4">
        <h2 className="text-xl font-bold mb-5">Top Sellers</h2>
        <ul>
          {authors.map((author, index) => (
            <li key={index} className="flex items-center justify-between mb-4">
              <section className="flex items-center">
                <img
                  src={author.image}
                  className="w-10 h-10 rounded-full"
                  alt={author.name}
                />
                <span className="ml-4">{author.name}</span>
              </section>
              <button
                onClick={() => handleFollowClick(index)}
                className={`py-1 px-3 rounded text-sm ${
                  author.isFollowing
                    ? "bg-red-500 text-white"
                    : "bg-black text-white"
                }`}
              >
                {author.isFollowing ? "Unfollow" : "Follow"}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Blogs */}
      <div className="bg-white p-5 border rounded">
        <h2 className="text-xl font-bold mb-5">Popular Blogs</h2>
        <ul>
          {blogs.map((blog, index) => (
            <li key={index} className="mb-5">
              <div className="font-semibold">
                <a href={blog.link} target="_blank" rel="noopener noreferrer" className="font-semibold text-xl underline ">
                  {blog.title}
                </a>
              </div>
              <div className="text-gray-600 text-sm mt-2">
                Published by {blog.author}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarContent;
