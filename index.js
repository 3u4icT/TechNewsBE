import express from "express";
import cors from "cors";
import Parser from "rss-parser";
const app = express();
const port = process.env.PORT || 3001;
const parser = new Parser();

// List of RSS feeds from top tech blogs
const RSS_FEEDS = [
  "https://ai.googleblog.com/feeds/posts/default",
  "https://netflixtechblog.com/feed",
  "https://engineering.fb.com/feed/",
  "https://blog.cloudflare.com/rss/",
  "https://developer.apple.com/news/rss/news.rss",
];

app.use(cors());

// Fetch articles from all RSS feeds
const fetchArticles = async () => {
  let articles = [];
  for (const feedUrl of RSS_FEEDS) {
    try {
      const feed = await parser.parseURL(feedUrl);
      const source = feed.title || "Unknown Source";
      feed.items.slice(0, 3).forEach((item) => {
        articles.push({
          title: item.title,
          link: item.link,
          source: source,
        });
      });
    } catch (error) {
      console.error(`Error fetching ${feedUrl}:`, error);
    }
  }
  return articles;
};

// API Route
app.get("/api/news", async (req, res) => {
  const articles = await fetchArticles();
  res.json(articles);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
