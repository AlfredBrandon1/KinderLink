import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Trivia = () => {
  const [trivia, setTrivia] = useState([]);

  useEffect(() => {
    const fetchTrivia = async () => {
      const response = await axios.get(
        'https://opentdb.com/api.php?amount=10&category=23&difficulty=easy&type=multiple'
      );
      setTrivia(response.data.results);
    };
    fetchTrivia();
  }, []);

  return (
    <div>
      <h1>Trivia and Facts for Children</h1>
      {trivia.map((triviaItem, index) => (
        <div key={index}>
          <h2>{triviaItem.question}</h2>
          <p>{triviaItem.correct_answer}</p>
        </div>
      ))}
    </div>
  );
};

export default Trivia;
