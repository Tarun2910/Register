import {Button, Dialog, Paper, Tooltip, Typography} from '@mui/material';
import React, {useEffect, useState} from 'react';
import HelpIcon from '@mui/icons-material/Help';
import Draggable from 'react-draggable';
import styles from './Quiz.module.css';
import axios from 'axios';
import {useParams} from 'react-router-dom';
import CustomizedBreadcrumbs from 'modules/muiComponents/navigation/Breadcrumbs/CustomizedBreadcrumbs';

function PaperComponent(props) {
  return (
    <Draggable
      handle='#draggable-dialog-title'
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const Quiz = () => {
  const {id} = useParams();
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [instruction, setInstruction] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizData, setQuizData] = useState([]);
  const [totalMarks, setTotalMarks] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [percentage, setpercentage] = useState(false);
  const [cousreResponse, setCourseResponse] = useState('');

  const retry = true;
  const Noretry = false;

  useEffect(() => {
    handleGetQuiz();
  }, []);

  const handleGetQuiz = async () => {
    try {
      const course = await axios.get(`/kms/users/course?courseId=${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          retry: 'false',
        },
      });
      const score = course.headers['score'];
      setpercentage(score);
      setCourseResponse(course?.data);

      if (course.data === 'not attempted') {
        const response = await axios.get(`/kms/courses/course/${id}/quiz`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
        });

        console.log(response);
        setQuizData(response?.data?.questions);
        setTotalMarks(response?.data?.totalMarks);
        setUserAnswers(new Array(response?.data?.questions.length).fill(''));
      }
    } catch (err) {
      console.log(err);
    } finally {
      console.log('');
    }
  };

  const handleAnswerSelection = (selectedChoice) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedChoice;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const CloseIntstruction = () => {
    setInstruction(false);
  };

  const handleRetryQuiz = async () => {
    try {
      const course = await axios.get(`/kms/users/course?courseId=${id}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          retry: retry,
        },
      });
      setCourseResponse(course?.data);

      if (course.data === 'not attempted') {
        const response = await axios.get(`/kms/courses/course/${id}/quiz`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
        });

        console.log(response);
        setQuizData(response?.data?.questions);
        setTotalMarks(response?.data?.totalMarks);
        setUserAnswers(new Array(response?.data?.questions.length).fill(''));
      }
    } catch (err) {
      console.log(err);
    } finally {
      console.log('');
    }
  };

  const handleSubmit = async () => {
    try {
      // Calculate the score
      let totalScore = 0;
      for (let i = 0; i < quizData.length; i++) {
        if (userAnswers[i] === quizData[i].correctAnswer) {
          totalScore += quizData[i].weightage;
        }
      }

      // Calculate percentage
      const obtainedPercentage = (totalScore / totalMarks) * 100;
      setpercentage(obtainedPercentage);

      const passingThreshold = 75;
      const hasPassed = obtainedPercentage >= passingThreshold;

      // Update state with submission status and pass/fail result
      setSubmissionStatus(true);
      setIsPassed(hasPassed);

      // Send the submission request with obtainedPercentage
      const response = await axios.post(
        `/kms/users/score?courseId=${id}&score=${obtainedPercentage}`,
        '',
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('jwt_token')}`,
          },
        },
      );
      // Optionally, you can update state or perform other actions based on the submission response.
    } catch (err) {
      console.log(err);
    }
  };

  const handlecheckquiz = () => {
    if (submissionStatus || cousreResponse !== 'not attempted') {
      return true;
    }
  };

  return (
    <>
      <div style={{marginBottom: '1rem'}}>
        {window.location.pathname === `/ecommerce/quiz/${id}` ? (
          <CustomizedBreadcrumbs showComponentName={false} />
        ) : (
          <CustomizedBreadcrumbs showComponentName={true} />
        )}
      </div>
      <Paper
        style={{
          padding: '1rem',
          height: 'auto',
          minHeight: '20rem',
          borderRadius: '2rem',
        }}
      >
        {quizData.length > 0 &&
          currentQuestion < quizData.length &&
          !submissionStatus && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <Typography variant='h5' gutterBottom>
                    Question {currentQuestion + 1}
                  </Typography>
                </div>
                <div>
                  <Typography variant='h5' gutterBottom>
                    {quizData[currentQuestion].weightage} Marks
                  </Typography>
                </div>
              </div>
              <div>
                <Typography style={{marginTop: '1rem', fontSize: '1.2rem'}}>
                  <b>{quizData[currentQuestion].question}</b>
                </Typography>

                {quizData[currentQuestion].choices.map(
                  (choice, choiceIndex) => (
                    <div key={choiceIndex} className={styles.newquiz_option}>
                      <input
                        type='radio'
                        id={`choice${choiceIndex}`}
                        name={`question${currentQuestion}`}
                        value={choice}
                        checked={userAnswers[currentQuestion] === choice}
                        onChange={() => handleAnswerSelection(choice)}
                        required
                      />
                      <label htmlFor={`choice${choiceIndex}`}>{choice}</label>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}

        {handlecheckquiz() && (
          <div>
            <Typography>Your obtained percentage: {percentage}%</Typography>
            <Typography>
              {isPassed || cousreResponse === 'passed' ? (
                'Congratulations! you have already passed the quiz '
              ) : (
                <div>
                  Unfortunately, you did not passed the Quiz.
                  <Button onClick={() => handleRetryQuiz()}>Retry Quiz</Button>
                </div>
              )}
            </Typography>
          </div>
        )}
      </Paper>
      <div
        style={{
          marginTop: '1rem',
          // marginRight: '2rem',
          display: 'flex',
          justifyContent: 'end',
          gap: '1rem',
        }}
      >
        {currentQuestion > 0 &&
          cousreResponse === 'not attempted' &&
          !submissionStatus && (
            <Button
              color='primary'
              variant='outlined'
              onClick={handlePreviousQuestion}
            >
              Previous
            </Button>
          )}
        {currentQuestion < quizData.length - 1 &&
          cousreResponse === 'not attempted' &&
          !submissionStatus && (
            <Button
              color='primary'
              variant='outlined'
              onClick={handleNextQuestion}
            >
              Next
            </Button>
          )}
        {currentQuestion === quizData.length - 1 &&
          cousreResponse === 'not attempted' &&
          !submissionStatus && (
            <Button color='primary' variant='outlined' onClick={handleSubmit}>
              Submit
            </Button>
          )}
      </div>
      <Dialog
        id='instructionForm'
        open={instruction}
        aria-labelledby='draggable-dialog-title'
        PaperComponent={PaperComponent}
      >
        {/* <Intruction CloseIntstruction={CloseIntstruction} */}
        {/* /> */}
      </Dialog>
    </>
  );
};

export default Quiz;
