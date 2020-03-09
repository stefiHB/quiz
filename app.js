

document.getElementById('start-btn').addEventListener('click', startQuiz);

var quiz_title = document.getElementById('quiz-title');
var quiz_description = document.getElementById('quiz-description');
var question_numbering = document.getElementById('question-numbering');

function startQuiz() {
    fetchData().then(questions => {
        console.log(questions);
        questions.forEach(quest => {
            
        });
    })
    .catch(err => {
        console.log('Error: ', err);
    });

}

function fetchData() {
    return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        request.open('GET', 'https://proto.io/en/jobs/candidate-questions/quiz.json');
        request.onload = function() {
            document.getElementById('start-container').style.display = "none";
            fetched_data = JSON.parse(request.responseText);
    
            quiz_title.innerText = fetched_data.title;
            quiz_description.innerText = fetched_data.description;
            var questions = fetched_data.questions;
            resolve(questions);
        }
    
        // TODO: Fix on error later
        request.onerror = reject;
        request.send();
    })
}