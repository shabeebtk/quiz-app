import { useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import logo from './assets/quiz-logo.png';
import pythonLogo from './assets/python-logo.png';
import jsLogo from './assets/javascript-logo.png';
import javaLogo from './assets/java-logo.png';
import goLogo from './assets/Go-Logo.png';
import djangoLogo from './assets/django-logo.png'
import postgrSQL from './assets/postgresql-logo.svg'
import mongoDB from './assets/mongodb-logo.svg'
import nodeJS from './assets/nodejs-logo.svg'
import closeLogo from './assets/close.png';
import { Link } from 'react-scroll';
import { Button } from '@mui/material';
import axios from 'axios';
import { sendMessageToGPT } from './api/openAI';
import Loader from './component/Loader';

function App() {

  const [selectedLanguage, setSelectedLanguage] = useState(null)
  const selected = useRef(null)
  const [response, setResponse] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [answerFeedback, setFeedback] = useState(null)
  const [feedbackLoader, setFeedbackLoader] = useState(false)
  const [loadQuestion, setLoadquestion] = useState(false)

  const GenarateQuestion = async (e) => {
    setLoadquestion(true)
    const prompt = `ask one theoretical question from ${e.currentTarget.dataset.value} programming language only return question no other sentences`
    setSelectedLanguage(e.currentTarget.dataset.value)
    const response = await sendMessageToGPT(prompt)
    setResponse(response)
    console.log(response)
    setLoadquestion(false)
  }

  const nextQuestion = async () => {
    setLoadquestion(true)
    const prompt = `ask one theoretical question from ${selectedLanguage} programming language only return question no other sentences. dont ask this question "${response}"`
    const nextQuestion = await sendMessageToGPT(prompt)
    setResponse(nextQuestion)
    console.log(nextQuestion)
    setFeedback(null)
    setUserAnswer('')
    setLoadquestion(false)
  }

  const submitAnswer = async () => {
    setFeedback(null)
    setFeedbackLoader(true)
    console.log(userAnswer)
    const prompt = `for this question "${response}" this is answer user given "${userAnswer}" give a feedback of this answer. dont write more that 100 character. give feedback and rate the answer out of 10, if the answer is not related to question return "not a valid answer and give the right paragraph answer"`
    const feedback = await sendMessageToGPT(prompt)
    setFeedback(feedback)
    console.log(feedback)
    setFeedbackLoader(false)
  }

  const close = () => {
    setSelectedLanguage(null)
    setFeedback(null)
  }


  return (
    <>
      <div className='logo_div'>
        <img className='app_logo' src={logo} alt="" />
      </div>

      {
        !selectedLanguage &&
        <>
        <div className='heading'>
          <h1>Choose your option</h1>
        </div>
          <div className='banner'>

            <div className='logo_parent'>
              <div className='logo_bg'>
                <button data-value="python" onClick={(e) => GenarateQuestion(e)} >
                  <img className='programming_logo' src={pythonLogo} alt="" />
                </button>
              </div>
              <div data-value="javascript" onClick={(e) => GenarateQuestion(e)} className='logo_bg'>
                <img className='programming_logo' src={jsLogo} alt="" />
              </div>
              <div data-value="java" onClick={(e) => GenarateQuestion(e)} className='logo_bg'>
                <img className='programming_logo' src={javaLogo} alt="" />
              </div>
              <div data-value="django" onClick={(e) => GenarateQuestion(e)} className='logo_bg'>
                <img className='programming_logo' src={djangoLogo} alt="" />
              </div>
              <div data-value="react" onClick={(e) => GenarateQuestion(e)} className='logo_bg'>
                <img className='programming_logo' src={reactLogo} alt="" />
              </div>
              <div data-value="mongoDB" onClick={(e) => GenarateQuestion(e)} className='logo_bg'>
                <img className='programming_logo' src={mongoDB} alt="" />
              </div>
              <div data-value="Postgresql" onClick={(e) => GenarateQuestion(e)} className='logo_bg'>
                <img className='programming_logo' src={postgrSQL} alt="" />
              </div>
              <div data-value="node js" onClick={(e) => GenarateQuestion(e)} className='logo_bg'>
                <img className='programming_logo' src={nodeJS} alt="" />
              </div>
            </div>
          </div>
        </>
      }


      {
        selectedLanguage &&
        <div id='quiz_section' ref={selected} className='quiz_body'>
          <div className='quiz_box'>
            <img onClick={close} className='close_btn' src={closeLogo} alt="" />
            <p className='question_text'>{!loadQuestion ? response : 'loading....'}</p>
            <div className='input_parent'>
              <textarea value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} placeholder='answer here' className='input_answer' name="" id="" rows="6"></textarea>
              <div className='button_div'>
                <Button onClick={nextQuestion} variant='contained'>Next</Button>
                <Button disabled={userAnswer.length < 10} onClick={submitAnswer} variant='contained'>submit</Button>
              </div>
            </div>

            {
              feedbackLoader && <Loader />
            }

            {answerFeedback &&
              <div className='input_parent' style={{ marginTop: '30px' }}>
                <p>feedback</p>
                <p className='feedback' name="" id="" >
                  {answerFeedback}
                </p>
              </div>
            }

          </div>
        </div>
      }

    </>
  )
}

export default App
