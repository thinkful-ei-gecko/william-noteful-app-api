import React from 'react'

function AddNoteError (props) {
    if (props.message) {
        return (
            <div>
                {props.message}
            </div>
        );
    }
    return <></>
}

export default AddNoteError;
