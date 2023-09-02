import React from "react";
import "./styles/general.css";
import Header from "./components/Header";
import GameArea from "./components/GameArea";
import Keyboard from "./components/Keyboard";
import LetterBox from "./components/LetterBox";
import wordsTextFile from "./words.txt";
import ErrorBox from "./components/Notification";
import Popup from "./components/Popup";
import keys from './KeysList';
import OrientationErrorPopup from "./components/OrientationErrorPopus";

export default function App() {
  const [letterboxGrid, setLetterboxGrid] = React.useState([]);
  const activeLetterboxRow = React.useRef(0);
  const activeLetterboxColumn = React.useRef(0);
  const [randomWord, setRandomWord] = React.useState("");
  let guessList = React.useRef([]);
  let guesses = React.useRef([]);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [wordsList, setWordsList] = React.useState([]);
  const [showErrorMessage, setShowErrorMessage] = React.useState(false);
  const [gameOver, setGameOver] = React.useState(false);
  const [showPopup, setShowPopup] = React.useState(false);
  const [keysList, setKeysList] = React.useState([...keys]);
  const [correctGuessedLetters, setCorrectGuessedLetters] = React.useState([]);
  const [showOrientationError, setShowOrientationError] = React.useState(false);

  async function getRandomWord() {
    try {
      const response = await fetch(wordsTextFile);
      const text = await response.text();
      const lines = text.split("\n");
      setWordsList(lines);
      const randomIndex = Math.floor(Math.random() * lines.length);
      const randomWord = lines[randomIndex];
      return randomWord;
    } catch (error) {
      console.error("Error fetching and processing words:", error);
      return null;
    }
  }
  function createNewGrid() {
    let newGrid = [];
    for (let row_index = 0; row_index < 6; row_index++) {
      let row = [];
      for (let col_index = 0; col_index < 5; col_index++) {
        row.push(<LetterBox key={`${row_index}, ${col_index}`} letter="" />);
      }
      newGrid.push(
        <div className="row" key={`${row_index}`}>
          {row}
        </div>
      );
    }
    setLetterboxGrid(newGrid);
  }
  function keyPress(letter) {
    const activeRow = activeLetterboxRow.current;
    const activeColumn = activeLetterboxColumn.current;
    setLetterboxGrid((prevState) => {
      const newGrid = prevState.map((row, rowIndex) => {
        const newRowChildren = row.props.children.map(
          (letterbox, columnIndex) => {
            if (rowIndex === activeRow && columnIndex === activeColumn) {
              return <LetterBox key={letterbox.key} letter={letter} />;
            } else {
              return letterbox;
            }
          }
        );

        return React.cloneElement(row, null, newRowChildren);
      });

      return newGrid;
    });
    if (
      activeLetterboxColumn.current <=
      letterboxGrid[activeLetterboxRow.current].props.children.length - 1
    ) {
      guessList.current.push(letter);
    }
    goToNextSquare();
  }
  function goToNextSquare() {
    if (
      activeLetterboxColumn.current <
      letterboxGrid[activeLetterboxRow.current].props.children.length - 1
    ) {
      activeLetterboxColumn.current += 1;
    } else {
      activeLetterboxColumn.current =
        letterboxGrid[activeLetterboxRow.current].props.children.length;
    }
  }
  function goToNextRow() {
    if (activeLetterboxRow.current < letterboxGrid.length - 1) {
      activeLetterboxRow.current += 1;
      activeLetterboxColumn.current = 0;
      guessList.current = [];
    } else {
      activeLetterboxRow.current = letterboxGrid.length;
      notification(`Game Over! The word was ${randomWord}!`, 1000000);
      setGameOver(true);
      setShowPopup(true);
    }
  }
  function goToPreviousSquare() {
    if (activeLetterboxColumn.current !== 0) {
      activeLetterboxColumn.current -= 1;
    }
  }
  function backspace() {
    if (gameOver === false) {
      goToPreviousSquare();
      const activeRow = activeLetterboxRow.current;
      const activeColumn = activeLetterboxColumn.current;
      setLetterboxGrid((prevState) => {
        const newGrid = prevState.map((row, rowIndex) => {
          const newRowChildren = row.props.children.map(
            (letterbox, columnIndex) => {
              if (rowIndex === activeRow && columnIndex === activeColumn) {
                return <LetterBox key={letterbox.key} letter="" />;
              } else {
                return letterbox;
              }
            }
          );

          return React.cloneElement(row, null, newRowChildren);
        });

        return newGrid;
      });
      guessList.current.pop();
    }
  }
  async function assignRandomWord() {
    const randomWord = await getRandomWord();
    setRandomWord(randomWord);
  }
  function notification(message, duration) {
    setErrorMessage(message);
    setShowErrorMessage(true);
    if (message !== "You win!") {
      setTimeout(() => {
        setShowErrorMessage(false);
      }, duration);
    } else {
      setTimeout(() => {
        setShowErrorMessage(false);
        setShowPopup(true);
      }, duration);
    }
  }
  function isLetterRepeated(string, letter) {
    let count = 0;
    for (let i = 0; i < string.length; i++) {
      const char = string[i];

      if (char === letter) {
        count++;
        if (count > 1) {
          return true;
        }
      }
    }
    return count > 1;
  }
  function updateKeyboard(letter, status) {
    let targetedRow;
    keysList[0].forEach(key => {
        if (key.key === letter){
            targetedRow = 0
        }
    })
    keysList[1].forEach(key => {
        if (key.key === letter){
            targetedRow = 1
        }
    })
    keysList[2].forEach(key => {
        if (key.key === letter){
            targetedRow = 2
        }
    })
    setKeysList(prevState => {
        let newState = prevState;
        newState = newState.map(row => {
            if(newState.indexOf(row) === targetedRow){
                let rowCopy = [...row];
                rowCopy.map(key => {
                    if (key.key === letter.toLowerCase()){
                        key.status = status;
                        return key;
                    }
                    else{
                        return key;
                    }
                })
                return rowCopy;
            }
            else{
                return row;
            }
        })
        return newState;
        
    })
  }
  function validateGuess(guess) {
    for (let i = 0; i < randomWord.length; i++) {
      const guessLetterBeingChecked = guess[i];
      const randomWordLetterBeingChecked = randomWord[i];
      if (randomWord.includes(guessLetterBeingChecked)) {
        if (randomWordLetterBeingChecked === guessLetterBeingChecked) {
          const activeRow = activeLetterboxRow.current;
          setLetterboxGrid((prevState) => {
            const newGrid = prevState.map((row, rowIndex) => {
              const newRowChildren = row.props.children.map(
                (letterbox, columnIndex) => {
                  if (rowIndex === activeRow && columnIndex === i) {
                    updateKeyboard(guessLetterBeingChecked, 'right-position')
                    if (!correctGuessedLetters.includes(guessLetterBeingChecked)){
                        setCorrectGuessedLetters(prevState => {
                            let newState = [...prevState]
                            newState.push(guessLetterBeingChecked)
                            return newState;
                        })
                    }
                    return (
                      <LetterBox
                        className={"right-position"}
                        key={letterbox.key}
                        letter={letterbox.props.letter}
                      />
                    );
                  } else {
                    return letterbox;
                  }
                }
              );
              return React.cloneElement(row, null, newRowChildren);
            });
            return newGrid;
          });
        } 
        else {
          if (isLetterRepeated(guess, guessLetterBeingChecked)) {
            const repeatedLetter = guessLetterBeingChecked;
            const firstOccurenceOfRepeatedLetter =
              guess.indexOf(repeatedLetter);
            let firstOccurenceMarked = false;
            const rightPosition = randomWord.indexOf(guessLetterBeingChecked);
            const activeRow = activeLetterboxRow.current;
            setLetterboxGrid((prevState) => {
              const newGrid = prevState.map((row, rowIndex) => {
                const newRowChildren = row.props.children.map(
                  (letterbox, columnIndex) => {
                    if (
                      rowIndex === activeRow &&
                      columnIndex === firstOccurenceOfRepeatedLetter &&
                      !firstOccurenceMarked &&
                      columnIndex !== rightPosition
                    ) {
                      firstOccurenceMarked = true;
                      if (!correctGuessedLetters.includes(guessLetterBeingChecked)){
                        updateKeyboard(guessLetterBeingChecked, 'wrong-position')
                      }
                      return (
                        <LetterBox
                          className={"wrong-position"}
                          key={letterbox.key}
                          letter={letterbox.props.letter}
                        />
                      );
                    } else if (rowIndex === activeRow && columnIndex === i) {
                      return (
                        <LetterBox
                          className={"guessed"}
                          key={letterbox.key}
                          letter={letterbox.props.letter}
                        />
                      );
                    } else {
                      return letterbox;
                    }
                  }
                );

                return React.cloneElement(row, null, newRowChildren);
              });

              return newGrid;
            });
          } else if (isLetterRepeated(randomWord, guessLetterBeingChecked)) {
            const activeRow = activeLetterboxRow.current;
            setLetterboxGrid((prevState) => {
              const newGrid = prevState.map((row, rowIndex) => {
                const newRowChildren = row.props.children.map(
                  (letterbox, columnIndex) => {
                    if (
                      rowIndex === activeRow &&
                      columnIndex === guess.indexOf(guessLetterBeingChecked)
                    ) {
                      if (!correctGuessedLetters.includes(guessLetterBeingChecked)){
                        updateKeyboard(guessLetterBeingChecked, 'wrong-position')
                      }
                      return (
                        <LetterBox
                          className={"wrong-position"}
                          key={letterbox.key}
                          letter={letterbox.props.letter}
                        />
                      );
                    } 
                    else if (rowIndex === activeRow && columnIndex === i) {
                    if (!correctGuessedLetters.includes(guessLetterBeingChecked)){
                      updateKeyboard(guessLetterBeingChecked, 'guessed')
                    }
                      return (
                        <LetterBox
                          className={"guessed"}
                          key={letterbox.key}
                          letter={letterbox.props.letter}
                        />
                      );
                    } else {
                      return letterbox;
                    }
                  }
                );

                return React.cloneElement(row, null, newRowChildren);
              });

              return newGrid;
            });
          } else {
            const activeRow = activeLetterboxRow.current;
            setLetterboxGrid((prevState) => {
              const newGrid = prevState.map((row, rowIndex) => {
                const newRowChildren = row.props.children.map(
                  (letterbox, columnIndex) => {
                    if (rowIndex === activeRow && columnIndex === i) {
                      if (!correctGuessedLetters.includes(guessLetterBeingChecked)){
                        updateKeyboard(guessLetterBeingChecked, 'wrong-position')
                      }
                      return (
                        <LetterBox
                          className={"wrong-position"}
                          key={letterbox.key}
                          letter={letterbox.props.letter}
                        />
                      );
                    } else {
                      return letterbox;
                    }
                  }
                );

                return React.cloneElement(row, null, newRowChildren);
              });

              return newGrid;
            });
          }
        }
      } else {
        const activeRow = activeLetterboxRow.current;
        setLetterboxGrid((prevState) => {
          const newGrid = prevState.map((row, rowIndex) => {
            const newRowChildren = row.props.children.map(
              (letterbox, columnIndex) => {
                if (rowIndex === activeRow && columnIndex === i) {
                    if (!correctGuessedLetters.includes(guessLetterBeingChecked)){
                        updateKeyboard(guessLetterBeingChecked, 'guessed')
                      }
                  return (
                    <LetterBox
                      className={"guessed"}
                      key={letterbox.key}
                      letter={letterbox.props.letter}
                    />
                  );
                } else {
                  return letterbox;
                }
              }
            );

            return React.cloneElement(row, null, newRowChildren);
          });

          return newGrid;
        });
      }
    }
  }
  function onEnter() {
    const guess = guessList.current.join("");
    if (guesses.current.includes(guess)) {
        notification("Word already guessed", 1500);
      } else if (guess === randomWord) {
        notification("You win!", 1500);
        validateGuess(guess);
        setGameOver(true);
      } else {
        if (guess.length !== randomWord.length) {
          notification("Not enough letters", 1500);
        } else if (wordsList.includes(guess.toLowerCase()) !== true) {
          notification("Not in word list", 1500);
        } else if (wordsList.includes(guess.toLowerCase())){
          guesses.current.push(guess);
          validateGuess(guess);
          goToNextRow();
        }
    }
    
  }
  function resetKeyboard(){
    setKeysList(
        [
            [  
            {
                key: 'q',
                status: 'normal'
            },
            {
                key: 'w',
                status: 'normal'
            },
            {
                key: 'e',
                status: 'normal'
            },
            {
                key: 'r',
                status: 'normal'
            },
            {
                key: 't',
                status: 'normal'
            },
            {
                key: 'y',
                status: 'normal'
            },
            {
                key: 'u',
                status: 'normal'
            },
            {
                key: 'i',
                status: 'normal'
            },
            {
                key: 'o',
                status: 'normal'
            },
            {
                key: 'p',
                status: 'normal'
            }
        ],
        [
            {
                key: 'a',
                status: 'normal'
            },
            {
                key: 's',
                status: 'normal'
            },
            {
                key: 'd',
                status: 'normal'
            },
            {
                key: 'f',
                status: 'normal'
            },
            {
                key: 'g',
                status: 'normal'
            },
            {
                key: 'h',
                status: 'normal'
            },
            {
                key: 'j',
                status: 'normal'
            },
            {
                key: 'k',
                status: 'normal'
            },
            {
                key: 'l',
                status: 'normal'
            }
        ],
        [
            {
                key: 'enter',
                status: 'normal'
            },
            {
                key: 'z',
                status: 'normal'
            },
            {
                key: 'x',
                status: 'normal'
            },
            {
                key: 'c',
                status: 'normal'
            },
            {
                key: 'v',
                status: 'normal'
            },
            {
                key: 'b',
                status: 'normal'
            },
            {
                key: 'n',
                status: 'normal'
            },
            {
                key: 'm',
                status: 'normal'
            },
            {
                key: 'backspace',
                status: 'normal'
            }
        ]
    ]
    );
  };
  function resetGame() {
    setLetterboxGrid([]);
    activeLetterboxRow.current = 0;
    activeLetterboxColumn.current = 0;
    assignRandomWord();
    guessList.current = [];
    guesses.current = [];
    setWordsList([]);
    resetKeyboard();
    setGameOver(false);
    setShowPopup(false);
    setCorrectGuessedLetters([]);
  }
  function handleOrientationChange(){
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (window.matchMedia("(orientation: landscape)").matches && isMobile){
        setShowOrientationError(true)
    }
    else{
        setShowOrientationError(false)
    }
  };
  function hamburgerMenuClick(){
    notification('This is just for decoration ;)', 1500)
  }
  React.useEffect(() => {
    if (letterboxGrid.length === 0) {
      createNewGrid();
    }
  }, [letterboxGrid]);
  React.useEffect(() => {
    assignRandomWord();
    notification('Refresh the page to get a new word!', 1500)
  }, []);
  React.useEffect(() => {
    window.addEventListener('resize', handleOrientationChange);
    handleOrientationChange();

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return (
    <div className="app">
      <Header hamburgerMenuClick={hamburgerMenuClick}/>
      {showErrorMessage && <ErrorBox message={errorMessage} />}
      <GameArea letterboxGrid={letterboxGrid} />
      <Keyboard keysList={keysList} keyPress={keyPress} backspace={backspace} onEnter={onEnter} />
      {showPopup && <Popup resetGame={resetGame} />}
      {showOrientationError && <OrientationErrorPopup />}
    </div>
  );
}
