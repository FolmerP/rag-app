
type QuestionProps = {
    question: string
    onQuestionChange: (value: string) => void
}

function QuestionBox(props: QuestionProps) {
    return (
        <textarea
            value={props.question}
            onChange={(e) => props.onQuestionChange(e.target.value)}
            />
    )
}

export default QuestionBox