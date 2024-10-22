//
console.log('%c👾 Hacker Alert! 🚨 Warning: Unauthorized access detected! Just kidding! But really, no hacking the quiz! 😉', 'color: red;font-size: 12px; font-family; "cursive";')
console.log('%cCheck out my LinkedIn Page: https://www.linkedin.com/in/abraham-bishop', 'color: cyan ;font-size: 12px; font-family; "cursive";')
console.log('%cFeel free to visit my github profile: https://github.com/CrypticCodeDeveloper', 'color: yellow ;font-size: 12px; font-family; "cursive";')

// when DOM Content has been loaded
document.addEventListener("DOMContentLoaded",()=>{
    const URL = 'https://the-trivia-api.com/v2/questions'
    let questionNum = 0;
    let score = 0;
    let noOfLives = 8;


    // function the trivia questions
    const fetchUrl = async (url) => {
        try {
            const res = await fetch(url)
            const json = await res.json()
            // Display the question
            displayQuestion(json)
        } catch (err) {
            console.error('Error caught: ', err)
        }
    }

    // restart quiz
    const restartQuiz = () => {
        score = 0;
        noOfLives = 8;
        questionNum = 0;
        fetchUrl(URL)
    }

    function playSound(audioFile) {
        // Create a new audio object
        const audio = new Audio(audioFile);

        audio.play().catch(error => {
            console.error('Failed to play sound:', error);
        });
    }

    const resetDisplay = () => {
        document.getElementById('breached-screen').classList.add('hidden')
        document.getElementById('success-screen').classList.add('hidden')
        document.getElementById('terminal').classList.remove('hidden')
    }

    // start again button
    document.getElementById('restart-btn').addEventListener('click',()=>{
        restartQuiz()
    })

    function decodeHtmlEntities(str) {
        const htmlEntities = {
            '&amp;': '&',
            '&lt;': '<',
            '&gt;': '>',
            '&quot;': '"',
            '&apos;': "'",
            '&nbsp;': ' ',
        };

        return str.replace(/&[a-zA-Z0-9#]+;/g, (match) => {
            return htmlEntities[match] || match;
        });
    }

    // function to display Question
    const displayQuestion = (json) => {
        // reset display
        resetDisplay()

        document.getElementById('score-display').textContent = score

        // Check if game has been won
        if(questionNum == json.length){
            questionNum = 0; // reset the question number
            displaySuccessMessage()
        }  else { // While game is still on
            const currentQuestionObject = json[questionNum]

            // Extract quiz info
            const questionText = currentQuestionObject.question.text
            const correctAnswer = currentQuestionObject.correctAnswer
            const incorrectAnswers = currentQuestionObject.incorrectAnswers
            const  options = shuffleOption([...incorrectAnswers, correctAnswer])

            // Inserting the score, lives, question and options into the DOM
            document.getElementById('lives-display').textContent = noOfLives
            document.getElementById('question-display').textContent = questionText
            document.getElementById('options-display').innerHTML = options.map(option => `<p class="text-white mb-1 hover:cursor-pointer hover:text-blue-500 before:content-['>>'] before:mr-2" id="answer">${option}</p>`).join('')

            // attaching event listeners to the options
            document.querySelectorAll('#answer').forEach((ans) => {
                ans.addEventListener("click",()=>{
                    checkOption(ans.textContent, correctAnswer, json)
                })
            })
        }
    }

    // function to shuffle question randomly
    const shuffleOption = (queArray) => {
        const noOfOptions = queArray.length
        let shuffledOptions = [];
        // While loop to loop through options and push random options to shuffledOptions array
        while (shuffledOptions.length != noOfOptions) {
            // While shuffledOptions array is not filled up with options, pick a random option
            const randomIndex = Math.floor(Math.random() * noOfOptions)
            const randomOption = queArray[randomIndex]
            // To avoid pushing the same option twice
            if(!(shuffledOptions.includes(randomOption))){
                shuffledOptions.push(randomOption)
            }
        }
        return shuffledOptions
    }

    const checkOption = (option, correctAnswer, json) => {
        if (noOfLives === 0) { // check if game is over
            displayLossMessage()
        } else if (decodeHtmlEntities(option.trim().toLowerCase()) == correctAnswer.trim().toLowerCase()){ // If the answer was picked right
            playSound('assets/correct-answer.mp3')
            score += 5
            questionNum += 1
            displayQuestion(json)
        } else { // If answer is wrong
            playSound('assets/wrong-answer.mp3')
            noOfLives -= 1;
            document.getElementById('lives-display').textContent = noOfLives
        }
    }

    const displaySuccessMessage = () => {
        playSound('assets/terminal-defended.mp3')
        document.getElementById('success-screen').classList.remove('hidden')
        document.getElementById('terminal').classList.add('hidden')
    }

    const displayLossMessage = () => {
        playSound('assets/system-breached.mp3')
        document.getElementById('breached-screen').classList.remove('hidden')
        document.getElementById('terminal').classList.add('hidden')
        setTimeout(() => {
            restartQuiz()
        }, 3000);
    }

    // Start the quiz
    fetchUrl(URL)
})
