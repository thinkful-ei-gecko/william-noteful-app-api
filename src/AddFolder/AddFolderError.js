import React from 'react'

function AddFolderError (props) {
    if (props.message) {
        return (
            <div>
                {props.message}
            </div>
        );
    }
    return <></>
}

export default AddFolderError;
