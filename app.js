

var quiz_title          = document.getElementById('quiz-title');
var quiz_description    = document.getElementById('quiz-description');
var question_numbering  = document.getElementById('question-numbering');
var question_container  = document.getElementById('question-container');
var answers_div         = document.createElement('div')

let questions, index;

document.getElementById('start-btn').addEventListener('click', startQuiz);

function startQuiz() {
    fetchData().then(questions => {
        console.log(questions);
        index = 0;
        displayQuestion();
    })
    .catch(err => {
        console.log('Error: ', err);
    });
}

/*
A Promise that fetches data from server
*/
function fetchData() {
    return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        request.open('GET', 'https://proto.io/en/jobs/candidate-questions/quiz.json');
        request.onload = function() {
            document.getElementById('start-container').style.display = "none";
            fetched_data = JSON.parse(request.responseText);
            
            // Initialize the quiz container
            quiz_title.innerText = fetched_data.title;
            quiz_description.innerText = fetched_data.description;
            questions = fetched_data.questions;
            resolve(questions);
        }
    
        request.onerror = reject;
        request.send();
    })
}

// create DOM elements for the question
function displayQuestion() {
    // Create necessary elements 
    let cur_question = questions[index];
    let q_title = document.createElement("h2");
    let q_img = document.createElement("img")
    // Declare value of elements
    question_numbering.innerText = `Question #${cur_question.q_id} out of ${questions.length}`
    q_title.innerText = cur_question.title;
    q_img.src = cur_question.img;
    createPossibleAnswers(cur_question);

    // Append elements on DOM
    question_container.appendChild(q_title);
    question_container.appendChild(q_img);
    question_container.appendChild(answers_div);    
}

function createPossibleAnswers(question) {
    let poss_answers = question.possible_answers
    console.log('Create ', question.question_type);
    switch(question.question_type) {
        case 'truefalse':
            trueFalse();
            break;
        case 'mutiplechoice-single':
            console.log('in case');
            multipleChoiceSingle(poss_answers);
            break;
        case 'mutiplechoice-multiple':
            multipleChoiceMultiple(poss_answers);
            break;
    }
}

function multipleChoiceSingle(poss_answers) {

    let multipleChoiceSingle_div = document.createElement('div');
    multipleChoiceSingle_div.innerHTML = '<h1>TEST</h1>';
    answers_div.appendChild(multipleChoiceSingle_div)

}