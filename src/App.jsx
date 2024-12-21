import { useEffect, useState } from 'react';
import { mockQuestions } from './data.js';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectAnswer, setSelectAnswer] = useState(null);
  const [showAnswer, setShowAnaswer] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerClick = (answer) => {
    setSelectAnswer(answer);
    setShowAnaswer(true);

    if (answer === questions[currentQuestion].correct_answer) {
      setScore((prev) => prev + 1);
    }

    setTimeout(() => {
      setCurrentQuestion((prev) => prev + 1);
      setShowAnaswer(false); // Reset for the next question
      setSelectAnswer(null); // Clear the selected answer
    }, 2000);
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('https://opentdb.com/api.php?amount=50&category=9&difficulty=easy&type=multiple');
        const data = await res.json();

        if (data && data.results && data.results.length > 0) {
          setQuestions(data.results);
        } else {
          console.error('No questions found or invalid response structure');
        }
        setLoading(false);
      } catch (error) {
        setQuestions(mockQuestions);
        console.log('Error fetching data', error);
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <h3>Loading Questions...</h3>;
  }

  if (currentQuestion >= questions.length) {
    return (
      <div className='  flex justify-center'>
        <div className=' bg-gradient-to-r from-indigo-500 to-green-400 p-10 rounded-lg'>
          <h1 className="text-2xl">Quiz Quest</h1>
          <h4 className="text-sm">Your Final Score: {score}/{questions.length}</h4>
          <button className="bg-pink-500 ml-2 p-2 rounded-md text-white" onClick={() => window.location.reload()}>
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const answers = [...question.incorrect_answers, question.correct_answer].sort(() => Math.random() - 0.5);

  return (
    <>
      <div className="flex justify-center ">
        <div className="shadow-xl shadow-indigo-500/50 bg-gradient-to-r from-cyan-500 to-blue-800 w-96 mt-5 text-center p-5 rounded-lg text-white">
          <h1 className="text-4xl text-sky-400 font-bold ">Quiz Quest</h1>
          <h4 className="text-lg text-pink-300">Score: {score}</h4>
          <h3 className="text-lg text-white-300 font-medium">{question.question}</h3>
          <div className="justify-items-center">
            {answers.map((answer, index) => (
              <button
               type="button"
                key={index}
                className={`p-2 hover:bg-gradient-to-r from-teal-400 to-blue-500  rounded-md w-72 m-2 text-white
                  ${showAnswer
                    ? answer === question.correct_answer
                      ? "bg-green-400"
                      : answer === selectAnswer
                        ? "bg-red-500"
                        : ""
                    : ""
                  } from-inherit`}
                onClick={() => handleAnswerClick(answer)}
                disabled={showAnswer}
              >
                {answer}
              </button>
            ))}
          </div>

          {showAnswer && (
            <p
              className={`${selectAnswer === question.correct_answer
                  ? "text-green-500"
                  : "text-red-500"
                }`}
            >
              {selectAnswer === question.correct_answer ? "Correct!" : "Wrong Answer"}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
