import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QuotesWidget.scss";

function QuotesWidget() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    async function fetchData() {
      const result = await axios.get("https://quotes-api.tickertape.in/");
      setQuote(result.data.quote);
      console.log(result.data.quote)
    }
    fetchData();
  }, []);

  return (
    <div className="quote-widget card">
      <div className="card__body">
        <p className="quote">{quote}</p>
      </div>
      <div className="card__footer">
        <p>Quote of the Day</p>
      </div>
    </div>
  );
}

export default QuotesWidget;
