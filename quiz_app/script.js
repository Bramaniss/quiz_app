// Fetch questions from Open Trivia API
async function fetchQuestions() {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10');
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  }
  
  // Function to shuffle array elements
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  let questions = [];
  let selectedAnswers = [];
  
  // Function to initialize the questionnaire
  async function initialize() {
    questions = await fetchQuestions();
    selectedAnswers = [];
    showHomePage();
  }
  
  // Function to display home page
  function showHomePage() {
    const homePage = document.getElementById('homePage');
    const playBtn = document.getElementById('playBtn');
  
    homePage.style.display = 'block';
  
    playBtn.addEventListener('click', startQuestionnaire);
  
    // Hide other pages
    questionPage.style.display = 'none';
    resultPage.style.display = 'none';
  }
  
  // Function to start the questionnaire
  function startQuestionnaire() {
    const homePage = document.getElementById('homePage');
    const questionPage = document.getElementById('questionPage');
    const question = document.getElementById('question');
    const optionsList = document.getElementById('options');
    const progress = document.getElementById('progress');
  
    homePage.style.display = 'none';
    questionPage.style.display = 'block';
  
    // Shuffle the questions for a random order
    shuffleArray(questions);
  
    let currentQuestionIndex = 0;
  
    function showNextQuestion() {
      if (currentQuestionIndex >= questions.length) {
        showResultPage();
        return;
      }
  
      const currentQuestion = questions[currentQuestionIndex];
      const answers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
      shuffleArray(answers);
  
      question.textContent = currentQuestion.question;
      optionsList.innerHTML = '';
  
      for (const answer of answers) {
        const listItem = document.createElement('li');
        listItem.textContent = answer;
        listItem.addEventListener('click', () => handleAnswer(answer));
        optionsList.appendChild(listItem);
      }
  
      progress.textContent = `${currentQuestionIndex + 1}/${questions.length}`;
  
      currentQuestionIndex++;
    }
  
    function handleAnswer(selectedAnswer) {
      selectedAnswers.push(selectedAnswer);
      showNextQuestion();
    }
  
    showNextQuestion();
  }
  
  // Function to display what kind of results you got
  function showResultPage() {
    const resultPage = document.getElementById('resultPage');
    const congratulations = document.getElementById('congratulations');
    const playAgainBtn = document.getElementById('playAgainBtn');
  
    resultPage.style.display = 'block';
  
    // Calculate the number of correctly answered questions
    const correctAnswersCount = questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.correct_answer ? 1 : 0);
    }, 0);
  
    // Display how you did
    congratulations.textContent = `Congratulations, you answered ${correctAnswersCount}/${questions.length} questions correctly.`;
  
    // Hide other pages
    homePage.style.display = 'none';
    questionPage.style.display = 'none';
  
    // Clear selected answers
    selectedAnswers = [];
  }
  
  // Event listener for the play again button
  playAgainBtn.addEventListener('click', initialize);
  
  // Initialize the questionnaire when the page loads
  initialize();