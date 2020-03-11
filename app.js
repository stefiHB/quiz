

var quiz_title          = document.getElementById('quiz-title');
var quiz_description    = document.getElementById('quiz-description');
var question_numbering  = document.getElementById('question-numbering');
var question_container  = document.getElementById('question-container');

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
    let q_title = document.createElement("h2");
    let q_img = document.createElement("img")
    // Declare value of elements
    let cur_question = questions[index];
    question_numbering.innerText = `Question #${cur_question.q_id} out of ${questions.length}`
    q_title.innerText = cur_question.title;
    q_img.src = cur_question.img;
    let ans_div = createPossibleAnswers(cur_question);

    // Append elements on DOM
    question_container.appendChild(q_title);
    // question_container.appendChild(q_img);
    question_container.appendChild(ans_div);    
}

// TODO: {possible_ansers and question type out of question}
function createPossibleAnswers(question) {
    let possible_answers = question.possible_answers;
    let ans_type_div;
    switch(question.question_type) {
        case 'truefalse':
            ans_type_div = trueFalse();
            break;
        case 'mutiplechoice-single':
            ans_type_div = multipleChoiceSingle(possible_answers);
            break;
        case 'mutiplechoice-multiple':
            ans_type_div = multipleChoiceMultiple(possible_answers);
            break;
    }
    return ans_type_div;
}

function multipleChoiceSingle(possible_answers) {

    let multipleChoiceSingle_div = document.createElement('div');
    possible_answers.forEach(poss_ans => {
        console.log(poss_ans.a_id, poss_ans.caption );
        let ans_el = document.createElement('button');
        ans_el.innerText = poss_ans.caption;
        ans_el.id = poss_ans.a_id;
        ans_el.addEventListener('click', chooseAnswer);
        multipleChoiceSingle_div.appendChild(ans_el);
        
    });
    return multipleChoiceSingle_div;

}

function chooseAnswer($event) {
    console.log('clicked ', $event.srcElement.id);
}