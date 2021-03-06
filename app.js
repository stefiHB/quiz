

var quiz_title          = document.getElementById('quiz-title');
var quiz_description    = document.getElementById('quiz-description');
var question_numbering  = document.getElementById('question-numbering');
var question_container  = document.getElementById('question-container');
var result_container    = document.getElementById('result-container');

let questions, index, quiz_id, my_results;
let total_points = 0 , points = 0;

function startQuiz() {
    fetchData().then(questions => {
        index = 0;
        displayQuestion();
    })
    .catch(err => {
        console.log('Error: ', err);
        quiz_title.innerText = "There was a problem connecting to server";

    });

    fetchResult().then((results) => {
        my_results = results;
    })
    .catch(err => {
        console.log("Error: ", err);
        quiz_title.innerText = "There was a problem connecting to server";
    });
}
/*
A Promise that fetches result score from server
*/
function fetchResult() {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', 'http://proto.io/en/jobs/candidate-questions/result.json');
        request.onload = function() {
            fetched_data = JSON.parse(request.responseText);
            if (fetched_data.quiz_id == quiz_id) {
                resolve(fetched_data.results);
            } else {
                reject();
            }
        }
        request.onerror = reject;
        request.send();
    })
}
/*
A Promise that fetches questions from server
*/
function fetchData() {
    return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        request.open('GET', 'https://proto.io/en/jobs/candidate-questions/quiz.json');
        request.onload = function() {
            fetched_data = JSON.parse(request.responseText);

            // Initialize the quiz container
            quiz_title.innerText = fetched_data.title;
            quiz_description.innerText = fetched_data.description;
            questions = fetched_data.questions;
            quiz_id = fetched_data.quiz_id;
            resolve(questions);
        }
    
        request.onerror = reject;
        request.send();
    })
}

// create DOM elements for the question
function displayQuestion() {
    if (index >= questions.length) {
        question_numbering.innerText = ''
        showResults();
    } else {
        let q_title = document.createElement("h2");
        let q_img = document.createElement("img")
        let cur_question = questions[index];

        question_numbering.innerText = `Question #${cur_question.q_id} out of ${questions.length}`
        q_title.innerText = cur_question.title;
        q_img.src = cur_question.img;
        total_points += parseInt(cur_question.points);
                
        let ans_div = createPossibleAnswers(cur_question);

        // Append question elements on DOM
        question_container.appendChild(q_title);
        question_container.appendChild(q_img);
        question_container.appendChild(ans_div);    
    }
}

function createPossibleAnswers(question) {
    let possible_answers = question.possible_answers;
    let ans_type_div;
    switch(question.question_type) {
        case 'truefalse':
            ans_type_div = trueFalse();
            break;
        case 'mutiplechoice-single':
            ans_type_div = multipleChoice(possible_answers);
            break;
        case 'mutiplechoice-multiple':
            ans_type_div = multipleChoiceMany(possible_answers);
            break;
    }
    return ans_type_div;
}

function trueFalse() {
    let truefalse_div = document.createElement('div');
    let ans_el = ``
    ans_el += `<input type="radio" name="possible_answers"
                id="true" value="true" onclick="validate_click()">`
    ans_el += `<label for="true">True</label>`
    ans_el += `<input type="radio" name="possible_answers"
                id="false" value="false" onclick="validate_click()">`
    ans_el += `<label for="false">False</label>`
    truefalse_div.innerHTML = ans_el;

    let submit_btn = document.createElement('button');
    submit_btn.addEventListener('click', submitAnswer);
    submit_btn.innerText = 'Submit';
    submit_btn.disabled = true;
    submit_btn.classList.add('submit-btn');
    truefalse_div.appendChild(submit_btn);
    return truefalse_div;
}

function multipleChoice(possible_answers) {
    let multipleChoice_div = document.createElement('div');
    let ans_el = ``
    possible_answers.forEach(poss_ans => {
        ans_el += `<input type="radio" name="possible_answers"
                    id="${poss_ans.a_id}" value="${poss_ans.caption}"
                    onclick="validate_click(this)">`
        ans_el += `<label for="${poss_ans.a_id}">${poss_ans.caption}</label>`
        multipleChoice_div.innerHTML = ans_el;
    });
    let submit_btn = document.createElement('button');
    submit_btn.addEventListener('click', submitAnswer);
    submit_btn.innerText = 'Submit';
    submit_btn.disabled = true;
    submit_btn.classList.add('submit-btn');

    multipleChoice_div.appendChild(submit_btn);
    return multipleChoice_div;
}

function multipleChoiceMany(possible_answers) {

    let multipleChoiceMany_div = document.createElement('div');
    let ans_el = ``
    possible_answers.forEach(poss_ans => {
        ans_el += `<input type="checkbox" name="possible_answers"
                    id="${poss_ans.a_id}" value="${poss_ans.caption}"
                    onclick="validate_click()">`
        ans_el += `<label for="${poss_ans.a_id}">${poss_ans.caption}</label>`
        multipleChoiceMany_div.innerHTML = ans_el;
    });
    let submit_btn = document.createElement('button');
    submit_btn.addEventListener('click', submitAnswer);
    submit_btn.innerText = 'Submit';
    submit_btn.disabled = true;
    submit_btn.classList.add('submit-btn');
    multipleChoiceMany_div.appendChild(submit_btn);
    return multipleChoiceMany_div;
}

function submitAnswer($event) {
    const btn = document.querySelector('button[class="submit-btn"]').disabled = true;
    const cur_question = questions[index];    
    let actual_asnwers = []         // ID of correct answers
    let selected_answers = []       // ID of selected answers from user

    switch(cur_question.question_type) {
        case 'truefalse':
            selected_answers.push(document.querySelector('input[name="possible_answers"]:checked').id);
            actual_asnwers.push(cur_question.correct_answer.toString());
            break;
        case 'mutiplechoice-single':
            selected_answers.push(parseInt(document.querySelector('input[name="possible_answers"]:checked').id));            
            actual_asnwers.push(parseInt(cur_question.correct_answer));
            break;
        case 'mutiplechoice-multiple':
            let checked_answers = document.querySelectorAll('input[name="possible_answers"]:checked');
            checked_answers.forEach(ans => selected_answers.push(parseInt(ans.id)));
            actual_asnwers = cur_question.correct_answer;
            break;
    }

    if(actual_asnwers.length <= 0) {
        alert("Please select an answer");
        return;
    }
    points += calculatePoints(selected_answers, actual_asnwers);

    selected_answers.forEach(selected_answer => {
        let ans_el = document.querySelector(`label[for="${selected_answer}"]`);
        if (!(actual_asnwers.includes(selected_answer))) {
            ans_el.classList.add("wrong_answer");
        }
    })

    actual_asnwers.forEach(actual_asnwer => {
        let ans_el = document.querySelector(`label[for="${actual_asnwer}"]`);
        ans_el.classList.add("actual_answer");
        
    })

    setTimeout(() => {
        index++;                                    // index for next Question
        question_container.innerHTML = '';          // Reset Question
        displayQuestion();                          // Display next Question
    }, 3000);
}

function calculatePoints(checked_answers, actual_answers) {
    if (checked_answers.length !== actual_answers.length) {
        return 0;
    }
    let isSameAnswers = true;
    // if checked answer is not inside to actual answers then its wrong
    checked_answers.forEach(checked_answer => {
        if( !(actual_answers.includes(checked_answer))) {
            isSameAnswers = false;
        }
    });

    if (isSameAnswers) {
        return questions[index].points;
    } else {
        return 0;
    }
}

function showResults() {
    let r_score = document.createElement("h2");
    let r_title = document.createElement("h2");
    let r_img = document.createElement("img")
    let r_msg = document.createElement("p");
    let percentage = (points * 100) / total_points;

    console.log(points);

    let cur_result = my_results.find( r => {
        return percentage >= r.minpoints && percentage <= r.maxpoints
    })
    r_score.innerText = `Score: ${percentage} / 100`;
    r_title.innerText = cur_result.title;
    r_msg.innerText = cur_result.message;
    r_img.src = cur_result.img
    
    // Append elements on DOM
    result_container.appendChild(r_score);
    result_container.appendChild(r_title);
    result_container.appendChild(r_img);
    result_container.appendChild(r_msg); 
}

function validate_click(event) {

    const btn = document.querySelector('button[class="submit-btn"]');
    const possible_answers = document.querySelectorAll('input[name="possible_answers"]');
    let isCheckValue = false;

    possible_answers.forEach(ans => {
        if (ans.checked) {
            isCheckValue = true;
            document.querySelector(`label[for="${ans.id}"]`).classList.add("selected_answer");
        } else {
            document.querySelector(`label[for="${ans.id}"]`).classList.remove("selected_answer");
        }
    })
    
    if (isCheckValue) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

startQuiz()