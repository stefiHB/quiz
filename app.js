

document.getElementById('start-btn').addEventListener('click', startQuiz);

var quiz_title = document.getElementById('quiz-title');
var quiz_description = document.getElementById('quiz-description');
var question_numbering = document.getElementById('question-numbering');

function startQuiz() {
    fetchData(function(questions) {
        console.log(questions);

    });

}

function fetchData() {
    let request = new XMLHttpRequest();
    request.open('GET', 'https://proto.io/en/jobs/candidate-questions/quiz.json');
    request.onload = function() {
        document.getElementById('start-container').style.display = "none";
        fetched_data = JSON.parse(request.responseText);

        quiz_title.innerText = fetched_data.title;
        quiz_description.innerText = fetched_data.description;
        var questions = fetched_data.questions;
        question_numbering.innerText = `Question ${1} out of ${questions.length}`
        console.log(questions);
        return questions;
    }

    // TODO: Fix on error later
    request.onerror = function() {
        return null;
    }
    request.send();

}