import React, { useState, useEffect } from 'react';
import axios from 'axios';

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      const response = await axios.get(
        'https://newsapi.org/v2/everything?q=benguet%20state%20university&apiKey=c01a12dd83c6403289a2e7891713c190'
      );
      setNews(response.data.articles);
    };
    fetchNews();
  }, []);

  return (
    <div>
      <h1>News about Benguet State University</h1>
      {news.map((article) => (
        <div key={article.url}>
          <h2>{article.title}</h2>
          <p>{article.description}</p>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            Read more
          </a>
        </div>
      ))}
    </div>
  );
};

export default News;
