import { MdArrowBackIosNew } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { useState, useContext } from "react"
import { pointsContext } from "./PointsProvider";
import { CHE_DO } from "../censtu/sdk";
import { useNhatKyVan } from "../censtu/useNhatKyVan";

const ReadingGame= () => {
    const navigate = useNavigate()

    function shuffleSounds() {
        return [
            {
                id: 0,
                word: "chair",
                answerOptions: [
                    {answerImg: "chair", isCorrect: true},
                    {answerImg: "jam", isCorrect: false},
                    {answerImg: "lobster", isCorrect: false},
                ]
            },
            {
                id: 1,
                word: "book",
                answerOptions: [
                    {answerImg: "jam", isCorrect: false},
                    {answerImg: "book", isCorrect: true},
                    {answerImg: "watch", isCorrect: false},
                ]
            },
            {
                id: 2,
                word: "shoe",
                answerOptions: [
                    {answerImg: "shoe",  isCorrect: true},
                    {answerImg: "snail", isCorrect: false},
                    {answerImg: "sweet", isCorrect: false},
                ]
            },
            {
                id: 3,
                word: "sweet",
                answerOptions: [
                    {answerImg: "moon", isCorrect: false},
                    {answerImg: "witch", isCorrect: false},
                    {answerImg: "sweet", isCorrect: true},
                ]
            },
            {
                id: 4,
                word: "witch",
                answerOptions: [
                    {answerImg: "book", isCorrect: false},
                    {answerImg: "train", isCorrect: false},
                    {answerImg: "witch", isCorrect: true},
                ]
            },
            {
                id: 5,
                word: "fish",
                answerOptions: [
                    {answerImg: "fish", isCorrect: true},
                    {answerImg: "lobster", isCorrect: false},
                    {answerImg: "train", isCorrect: false},
                ]
            },
            {
                id: 6,
                word: "cow",
                answerOptions: [
                    {answerImg: "moon", isCorrect: false},
                    {answerImg: "shoe", isCorrect: false},
                    {answerImg: "cow", isCorrect: true},
                ]
            },
            {
                id: 7,
                word: "shell",
                answerOptions: [
                    {answerImg: "fish", isCorrect: false},
                    {answerImg: "shell", isCorrect: true},
                    {answerImg: "snail", isCorrect: false},
                ]
            },
            {
                id: 8,
                word: "train",
                answerOptions: [
                    {answerImg: "train", isCorrect: true},
                    {answerImg: "jam", isCorrect: false},
                    {answerImg: "chair", isCorrect: false},
                ]
            },
            {
                id: 9,
                word: "watch",
                answerOptions: [
                    {answerImg: "sweet", isCorrect: false},
                    {answerImg: "cow", isCorrect: false},
                    {answerImg: "watch", isCorrect: true},
                ]
            },
        ].sort(() => Math.random() - 0.5).slice(0,5)
    }

    const [quizQuestions, setQuizQuestions] = useState(shuffleSounds)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [displayEndPage, setdisplayEndPage] = useState(false)
    const [answered, setAnswered] = useState()
    const [cantContinue, setCantContinue] = useState(true)
    const incrementalPoints = useContext(pointsContext)[1]
    const { ghi, ketThuc, batDauLai } = useNhatKyVan(CHE_DO.DOC_TU_PHASE_3)

    function newGame() {
        batDauLai()
        setdisplayEndPage(false)
        setCurrentQuestion(0)
        setQuizQuestions(shuffleSounds())
      }

    const handleNextBtnClick = () => {
        setAnswered()
        setCantContinue(true)
        const nextQuestion = currentQuestion + 1
        if (nextQuestion < quizQuestions.length) {
            setCurrentQuestion(nextQuestion)
        }
        else {
            setdisplayEndPage(true)
            incrementalPoints()
            ketThuc()
        }
    }

    const handleAnswer = (isCorrect, answerText) => {
        ghi(quizQuestions[currentQuestion].word, answerText, isCorrect)
        const trueAnswer = "Correct ✅"
        const falseAnswer = "Try again ❌"
        if (isCorrect === true) {
            setCantContinue(false)
            setAnswered(trueAnswer)
        } else {
            setAnswered(falseAnswer)
            setTimeout(() => { setAnswered("") }, 800)
        }      
     }

    return ( 
        <section>
                <header>    
                <p onClick={() => navigate(-1)}><MdArrowBackIosNew className="back-arrow" /></p>
                <h1>Reading game</h1>
            </header>
            {displayEndPage ? (
                <div className="well-done">   
                <h1>Well done!</h1>
                   <span className="well-done-icon animate-beat">🎉</span>
                   <button className="new-game-btn" onClick={newGame}>Play again</button>
                  <div className="back-to-games-btn" onClick={() => navigate(-1)}>Back to Games</div>
                </div>
            ) : (
                <>
                <div className="quiz-container">
                    <div className="reading-game-word">
                        <div>{quizQuestions[currentQuestion].word}</div>
                    </div>
                    <div className="quiz-options">
                        { quizQuestions[currentQuestion].answerOptions.map((answer, index) => {                     
                            return (
                            <div className="sound reading-card" onClick={() => handleAnswer(answer.isCorrect, answer.answerImg)}>
                                <img className="reading-images" src={`../images/reading-images/${answer.answerImg}.png`} alt={answer.answerImg} />
                            </div>
                            )})
                        }
                    </div>
                    <p className="quiz-tip">{answered}</p>
                    <button className="next-btn" disabled={cantContinue} onClick={handleNextBtnClick}>Next</button>    
                </div>
            </>
            )}
        </section> 
    );
}
 
export default ReadingGame