import { useState, useEffect } from "react";
import clsx from "clsx";
import Confetti from "react-confetti";
import { languages } from "./languae";
import { getFarewellText,getRandomWord } from "./utilis";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./App.css";

export default function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Derived values
  const lastEleInLanguages = languages[languages.length - 1];
  const wrongGuessedCount = guessedLetters.filter(
    (letter) => !currentWord.word.includes(letter)
  ).length;

  const lastWrongGuessedEle = guessedLetters[guessedLetters.length - 1];
  const lastEleIncorrect =
    lastWrongGuessedEle && !currentWord.word.includes(lastWrongGuessedEle);

  const isGameWon = currentWord.word
    .split("")
    .every((letter) => guessedLetters.includes(letter));
  const isGameLost = wrongGuessedCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  // Handle keyboard letter input
  function handleAddKeyboardLetter(letter) {
    setGuessedLetters((prevLetters) => {
      const lettersSet = new Set(prevLetters);
      lettersSet.add(letter);
      return Array.from(lettersSet);
    });
  }

  // Reset game
  function handleResetGame() {
    setCurrentWord(() => getRandomWord());
    setGuessedLetters([]);
    setShowCodeModal(false);
  }

  // Get revealed code snippet
  const getRevealedSnippet = () => {
    return currentWord.code
      .split("")
      .map((char) => {
        const lowerChar = char.toLowerCase();
        if (/[a-z]/i.test(char) && currentWord.word.includes(lowerChar)) {
          return guessedLetters.includes(lowerChar) ? char : "_";
        }
        return char;
      })
      .join("");
  };

  // Show modal on win
  useEffect(() => {
    if (isGameWon) setShowCodeModal(true);
  }, [isGameWon]);

  // Language chips
  const languageElements = languages.map((lang, index) => {
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    return (
      <span
        className={clsx("chip", {
          lost: index < wrongGuessedCount,
        })}
        style={styles}
        key={lang.name}
      >
        {lang.name}
      </span>
    );
  });

  // Letter elements
  const letterElements = currentWord.word.split("").map((letter, index) => {
    if (isGameLost) {
      return (
        <span
          key={index}
          style={{
            color: `${guessedLetters.includes(letter) ? "#EC5D49" : "white"}`,
          }}
        >
          {letter}
        </span>
      );
    } else {
      return (
        <span key={index}>
          {guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
        </span>
      );
    }
  });

  // Keyboard elements
  const keyboardElements = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.word.includes(letter);
    const isWrong = isGuessed && !currentWord.word.includes(letter);

    return (
      <button
        className={clsx("button", {
          correct: isCorrect,
          wrong: isWrong,
        })}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`Letter ${letter}`}
        key={letter}
        onClick={() => handleAddKeyboardLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  // Game status
  const gameStatusClassName = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    fareWell: !isGameOver && lastEleIncorrect,
  });

  function displayGameStatus() {
    if (!isGameOver && lastEleIncorrect) {
      return <p>{getFarewellText(languages[wrongGuessedCount - 1].name)}</p>;
    }
    if (isGameWon) {
      return (
        <div>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </div>
      );
    } else if (isGameLost) {
      return (
        <div>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </div>
      );
    }
  }

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className={gameStatusClassName} aria-live="polite" role="status">
        {displayGameStatus()}
      </section>
      <section className="code-snippet">
        <pre className="snippet-preview">{getRevealedSnippet()}</pre>
      </section>
      <section className="sr-only">
        <p>
          {currentWord.word.includes(lastEleIncorrect)
            ? `Correct! The letter ${lastEleIncorrect} includes`
            : `Wrong! The letter ${lastEleIncorrect} not includes`}
        </p>
        <p>`You have only ${lastEleInLanguages.name}`</p>
        {guessedLetters.map((letter) =>
          currentWord.word.includes(letter) ? letter + "." : "blank"
        )}
      </section>
      <section className="language-chips">{languageElements}</section>
      <section className="word">{letterElements}</section>
      <section className="keyboard">{keyboardElements}</section>
      {isGameOver && (
        <button className="new-game" onClick={handleResetGame}>
          New Game
        </button>
      )}
      {showCodeModal && (
        <div className="modal-overlay">
          <div className="code-modal">
            <h3>Code Explanation</h3>
            <SyntaxHighlighter language={currentWord.language} style={vscDarkPlus}>
              {currentWord.code}
            </SyntaxHighlighter>
            <p>{currentWord.explanation}</p>
            <button onClick={() => setShowCodeModal(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  );
}