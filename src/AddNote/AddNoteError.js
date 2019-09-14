import React from 'react'

function AddNoteError (props) {
    if (props.message) {
        return (
            <div className="error-message">
                {props.message}
            </div>
        );
    }
    return <></>
}

export default AddNoteError;
