import React from 'react'

function AddFolderError (props) {
    if (props.message) {
        return (
            <div className="error-message">
                {props.message}
            </div>
        );
    }
    return <></>
}

export default AddFolderError;
