import React, { Component } from 'react';

export default class AddNote extends Component {
    render() {
        // console.log(this.props)
        return (
            <div className="addNoteForm">
                <form onSubmit={(e) => this.props.addNote(e)}>
                    <div>
                        <label htmtFor="note-name">Please enter note name</label>
                        <input type="text" id="note-name" name="note-name" value={this.props.newNote.name}
                        onChange={(e) => this.props.updateNewNote(e, 'name')}></input>
                    </div>
                    <div>
                        <label htmtFor="note-content">Please enter note's content</label>
                        <input type="text" id="note-content" name="note-content" value={this.props.newNote.content}
                        onChange={(e) => this.props.updateNewNote(e, 'content')}></input>
                    </div>
                    <div>
                        <button type="submit">Submit Note</button>
                    </div>
                </form>
            </div>
        )
    }
}

//name of note
//content of note