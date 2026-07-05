
type DocumentProps = {
    document: string
    onDocumentChange: (value: string) => void
}

function DocumentInput(props: DocumentProps) {
    return (
    <div>
        <textarea
            value={props.document}
            onChange={(e) => props.onDocumentChange(e.target.value)}
            />
    </div>
    )
}

export default DocumentInput