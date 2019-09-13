import React, { Component } from 'react';
import AddNoteError from './AddNoteError';

export default class AddNote extends Component {
 
    
    validateNoteName = () => {
        const name = this.props.newNote.name.trim();

        if(name.length === 0) {
            return 'Please enter a name';
        } else if(name.length < 2) {
            return 'Please enter a note that is longer than 2 characters';
        }
    }

    validateNoteContent = () => {
        const content = this.props.newNote.content.trim();

        if(content.length === 0) {
            return 'Please enter description';
        } else if(content.length < 0 || content.length > 80) {
            return 'Please enter a description that is between 1 and 80 characters';
        }
    }

    render() {
        // console.log(this.props)
        let noteNameError = this.validateNoteName();
        let contentError = this.validateNoteContent();
        return (
            <div className="addNoteForm">
                <form onSubmit={(e) => this.props.addNote(e)}>
                    <div>
                        <label htmtFor="note-name">Please enter note name</label>
                        <input type="text" id="note-name" name="note-name" value={this.props.newNote.name}
                        onChange={(e) => this.props.updateNewNote(e, 'name')}></input>
                        <AddNoteError message={noteNameError} />
                    </div>
                    <div>
                        <label htmtFor="note-content">Please enter note's content</label>
                        <input type="text" id="note-content" name="note-content" value={this.props.newNote.content}
                        onChange={(e) => this.props.updateNewNote(e, 'content')}></input>
                        <AddNoteError message={contentError} />
                    </div>
                    <div>
                        <button type="submit" disabled={noteNameError || contentError}>Submit Note</button>
                    </div>
                </form>
            </div>
        )
    }
}

//name of note
//content of note