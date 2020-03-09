const Question = {
    q_id: Number,
    title: String,
    img: String,
    question_type: QuestionType,
    possible_answers: PossibleAnswers,

}

const QuestionType = {
    TRUEFALSE: 'truefalse',
    MULTIPLECHOICE_SINGLE: 'multiplechoice_single',
    MULTIPLECHOICE_MULTIPLE: 'multiplechoice_multiple'
};

const PossibleAnswers = {
    a_id: Number,
    caption: String
}

module.exports = Question