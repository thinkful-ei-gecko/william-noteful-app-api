import React, { Component } from 'react'

export default class EditNote extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      id: '',
      note_name: '',
      content: '',
      folder: 1,
      modified: new Date()
      };
    }
  
  componentDidMount() {
    const noteId = this.props.match.params.noteId;
    fetch(`http://localhost:8000/api/notes/${noteId}`, {
      method: 'GET'
    })
    .then(res => {
      if(!res.ok) {
        return Promise.reject('Error, try again')
      }
      return res.json();
    })
    .then(data => {
      this.setState({
        id: data.id,
        note_name: data.note_name,
        content: data.content,
        folder: data.folder,
        modified: data.modified
      })
    })
    .catch(error => {
      console.error(error)
      this.setState( {error} )
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const noteId = this.props.match.params.noteId;
    const { id, note_name, content, folder, modified } = this.state;
    const updatedNote = { id, note_name, content, folder, modified };
    fetch(`http://localhost:8000/api/notes/${noteId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updatedNote)
    })
    .then(res => {
      if(!res.ok) {
        return Promise.reject('Error, try again')
      }
    })
    .then(() => {
      this.props.updateNote(updatedNote)
      this.props.history.push('/')
    })
  }


  render() {
    // console.log(this.props)
    const { note_name, content, folder } = this.state;
    return (
      <div className="addNoteForm">
      <form onSubmit={(e) => this.handleSubmit(e)}>
          <div className="note-name">
              <label htmlFor="note-name" className="add-note-label">Please enter note name</label>
              <br />
              <input type="text" id="note-name" name="note_name" value={note_name}
              onChange={(e) => {this.handleChange(e)}}></input>
          </div>
          <div className="note-content">
              <label htmlFor="note-content" className="add-note-label">Please enter note's content</label>
              <br />
              <input type="text" id="note-content" name="content" value={content}
              onChange={(e) => {
              this.handleChange(e);
              }}></input>
          </div>
          <div className="note-folderId">
              <label htmlFor="folder-names" className="add-note-label">Please select a folder</label>
              <br />
              <select 
                name="folder" 
                id="folder-names"
                value={folder}
                onChange={(e) => {
                    this.handleChange(e);
                }}
                >
                  <option value="">Select folder...</option>
                  {this.props.folders.map(folder => <option value={folder.id} key={folder.id}>{folder.folder_name}</option>)}
              </select>
          </div>
          <div className="button-div">
              <button type="submit">Submit Note</button>
          </div>
      </form>
  </div>
    )
  }
}
