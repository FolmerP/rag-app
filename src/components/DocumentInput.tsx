
type DocumentProps = {
    document: string
    onDocumentChange: (value: string) => void
}

function DocumentInput(props: DocumentProps) {
    return (
    <div>
        <label className="field-label">Document</label>
        <textarea
        className="text-field"
        placeholder="Insert your document here"
            value={props.document}
            onChange={(e) => props.onDocumentChange(e.target.value)}
            />
    </div>
    )
}

export default DocumentInput