import "./App.css";
import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faTumblr } from "@fortawesome/free-brands-svg-icons";
import { useSpring, animated } from "react-spring";

function AnimatedText({ quote }) {
  const springProps = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });

  return (
    <animated.div style={springProps}>
      <figure>
        <blockquote className="blockquote text-center">
          <p id="text" className="form-field">
            <FontAwesomeIcon icon={faQuoteLeft} />
            {quote.quoteText}
          </p>
          <footer className="blockquote-footer form-field" id="author">
            {quote.quoteAuthor}
          </footer>
        </blockquote>
      </figure>
    </animated.div>
  );
}

function App() {
  const quotesUrl =
    "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json";

  const colors = [
    "#16a085",
    "#27ae60",
    "#2c3e50",
    "#f39c12",
    "#e74c3c",
    "#9b59b6",
    "#FB6964",
    "#342224",
    "#472E32",
    "#BDBB99",
    "#77B1A9",
    "#73A857",
  ];

  const [currentQuote, setCurrentQuote] = useState({
    quoteText: "",
    quoteAuthor: "",
  });

  const [listQuotes, setListQutes] = useState([]);

  useEffect(() => {
    fetch(quotesUrl)
      .then((res) => res.json())
      .then((data) => {
        setListQutes(data.quotes);
        getRandomQuote(data.quotes);
        setRandomColor();
      });
  }, []);

  const getRandomQuote = (listData = listQuotes) => {
    let randomQuote = listData[Math.floor(Math.random() * listData.length)];
    if (randomQuote !== undefined) {
      setCurrentQuote(() => ({
        quoteText: randomQuote.quote,
        quoteAuthor: randomQuote.author,
      }));

      setRandomColor();
    }
  };

  const setRandomColor = () => {
    let randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
    document.body.style.color = randomColor;
  };

  return (
      <div id="quote-box" className="well well-sm">
        <div className="quote-form">
          <AnimatedText key={currentQuote.quoteText} quote={currentQuote} />
          <div className="row">
            <button className="btn btn-xs btn-primary col-sm-1 my-4 mx-2  share-btn">
              <a
                href={`https://www.tumblr.com/widgets/share/tool?posttype=quote&tags=quotes,freecodecamp&caption='${encodeURIComponent(
                  currentQuote.quoteAuthor
                )}&content=${encodeURIComponent(currentQuote.quoteText)}`}
                rel="noreferrer"
                target="_blank"
              >
                <FontAwesomeIcon icon={faTumblr} color="#ffffff" />
              </a>
            </button>
            <button className="btn btn-xs btn-primary col-sm-1 my-4 share-btn">
              <a
                id="tweet-quote"
                href={`https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=${encodeURIComponent(
                  currentQuote.quoteText
                )}${currentQuote.quoteAuthor}`}
                rel="noreferrer"
                target="_blank"
              >
                <FontAwesomeIcon icon={faTwitter} color="#ffffff" />
              </a>
            </button>
            <button
              className="btn btn-lg btn-primary col-sm-4 my-4 ms-auto"
              id="new-quote"
              onClick={() => {
                getRandomQuote();
              }}
            >
              New quote
            </button>
          </div>
        </div>
      </div>
  );
}

export default App;
