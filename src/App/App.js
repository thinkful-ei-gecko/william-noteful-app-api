import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import { getNotesForFolder, findNote, findFolder } from '../notes-helpers';
import './App.css';
import UserContext from '../UserContext';
import EditNote from '../EditNote/EditNote';
import EditFolder from '../EditFolder/EditFolder';

class App extends Component {
    state = {
        notes: [],
        folders: [],
        newFolderName: '',
        newNote: {
            name: '',
            content: '',
            folderId: ''
        }
    };


    deleteNote = (noteId) => {
        // console.log('deleteNote in Apps working', noteId)
        return (
            fetch(`https://tranquil-sands-99231.herokuapp.com/api/notes/${noteId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                // .then(response => response.json())
                .then(this.setState({ notes: this.state.notes.filter(note => note.id !== noteId) }))
        )
    }


    deleteFolder = (folderId) => {
        return (
            fetch(`https://tranquil-sands-99231.herokuapp.com/api/folders/${folderId}`, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json'
                }
            })
            .then(() => {
                this.setState({
                    folders: this.state.folders.filter(folder => folder.id !== folderId)
                })
            })
        )
    }


    componentDidMount() {

        Promise.all([
            fetch(`https://tranquil-sands-99231.herokuapp.com/api/notes/`),
            fetch(`https://tranquil-sands-99231.herokuapp.com/api/folders/`)
        ])
            .then(([responseNote, responseFolder]) =>
                Promise.all([responseNote.json(), responseFolder.json()])
                    .then(([notes, folders]) => this.setState({ notes, folders }))
            )
    }

    updateNewFolder = (e) => {
        // console.log('updateNewFolder firing')
        this.setState({
            newFolderName: e.target.value
        })
    }

    addFolder = (e) => {
        e.preventDefault();
        const body = JSON.stringify({ folder_name: this.state.newFolderName });
        fetch(`https://tranquil-sands-99231.herokuapp.com/api/folders/`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: body
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                throw new Error('something went wrong')
            })
            .then((data) => {
                console.log(data)
                this.setState({ folders: [...this.state.folders, data] })
            })
            .catch(err => {
                alert(`Error: ${err.message}`)
            })
    }


    updateNewNote = (e, inputName) => {
        // console.log(e.target.value)
        let newNote = {...this.state.newNote, [inputName]: e.target.value}
        this.setState({
            newNote
        })
    }


    addNote = (e) => {
        // console.log(this.state.newNote.name);
        e.preventDefault();
        const body = JSON.stringify(
            {
                note_name: this.state.newNote.name,
                content: this.state.newNote.content,
                folder: this.state.newNote.folderId
            }
        )
        fetch(`https://tranquil-sands-99231.herokuapp.com/api/notes/`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: body
        })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                throw new Error('something went wrong')
            })
            .then((data) => {
                console.log(data)
                this.setState({ notes: [...this.state.notes, data] })
            })
            .catch(err => {
                alert(`Error: ${err.message}`)
            })
    }

    updateNote = (updatedNote) => {
        const newNotes = this.state.notes.map(note => 
          (note.id === updatedNote.id)
            ? updatedNote
            : note
        );
        this.setState({
            notes: newNotes
        })
    };


    updateFolder = (updatedFolder) => {
        const newFolders = this.state.folders.map(folder => 
          (folder.id === updatedFolder.id)
            ? updatedFolder
            : folder
          );
        this.setState({
            folders: newFolders
        })
    }

    renderNavRoutes() {
        const { notes, folders, newFolderName, newNote } = this.state;
        return (
            <>
                <UserContext.Provider value={{ ...this.state }}>
                    {['/', '/folder/:folderId'].map(path => (
                        <Route
                            exact
                            key={path}
                            path={path}
                            render={routeProps => (
                                <NoteListNav
                                    folders={folders}
                                    notes={notes}
                                    newFolderName={newFolderName}
                                    deleteNote={this.deleteNote}
                                    {...routeProps}
                                    updateNewFolder={this.updateNewFolder}
                                    addFolder={this.addFolder}
                                    deleteFolder={this.deleteFolder}
                                />
                            )}
                        />
                    ))}
                    <Route
                        path="/note/:noteId"
                        render={routeProps => {
                            const { folderId } = routeProps.match.params;
                            // const note = findNote(notes, parseInt(noteId)) || {};
                            const folder = findFolder(folders, parseInt(folderId));
                            return <NotePageNav
                                newNote={newNote}
                                {...routeProps}
                                folder={folder}
                                routeProps={this.routeProps}
                            />;
                        }}
                    />
                    <Route path="/add-folder" component={NotePageNav} />
                    <Route path="/add-note"/>
                    <Route
                        path="/edit/:noteId" 
                        render={routeProps => {
                            const { noteId } = routeProps.match.params;
                            const note = findNote(notes, parseInt(noteId));
                            return <EditNote 
                                {...routeProps}
                                note={note}
                                folders={this.state.folders}
                                notes={this.state.notes}
                                deleteNote={this.deleteNote} 
                                updateNewNote={this.updateNewNote}
                                newNote={this.state.newNote}
                                addNote={this.addNote}
                                updateNote={this.updateNote}
                                />;
                        }}
                    />
                    <Route 
                        path="/editFolder/:folderId"
                        render={routeProps => {
                            const { folderId } = routeProps.match.params;
                            const folder = findFolder(folders, parseInt(folderId));
                            return <EditFolder 
                                {...routeProps}
                                folder={folder}
                                folders={this.state.folders}
                                notes={this.state.notes}
                                deleteNote={this.deleteNote} 
                                updateNewNote={this.updateNewNote}
                                newNote={this.state.newNote}
                                addNote={this.addNote}
                                updateFolder={this.updateFolder}
                                newFolderName={this.state.newFolderName}
                            />
                        }}
                    
                    />
                </UserContext.Provider>
            </>
        );
    }

    renderMainRoutes() {
        const { notes, folders, newNote } = this.state;
        return (
            <>
                <UserContext.Provider value={{ ...this.state }}>
                    {['/', '/folder/:folderId'].map(path => (
                        <Route
                            exact
                            key={path}
                            path={path}
                            render={routeProps => {
                                const { folderId } = routeProps.match.params;
                                const notesForFolder = getNotesForFolder(
                                    notes,
                                    parseInt(folderId)
                                );
                                return (
                                    <NoteListMain
                                        {...routeProps}
                                        notes={notesForFolder}
                                        deleteNote={this.deleteNote}
                                        updateNewNote={this.updateNewNote}
                                        newNote={newNote}
                                        addNote={this.addNote}
                                        folders={folders}
                                    />
                                );
                            }}
                        />
                    ))}
                    <Route
                        path="/note/:noteId"
                        render={routeProps => {
                            const { noteId } = routeProps.match.params;
                            const note = findNote(notes, parseInt(noteId));
                            return <NotePageMain 
                                {...routeProps} 
                                note={note} 
                                deleteNote={this.deleteNote} 
                                updateNewNote={this.updateNewNote}
                                newNote={newNote}
                                addNote={this.addNote}
                                />;
                        }}
                    />
                </UserContext.Provider>
            </>
        );
    }

    render() {
        // console.log(this.state)
        return (
            <div className="App">
                <nav className="App__nav">{this.renderNavRoutes()}</nav>
                <header className="App__header">
                    <h1>
                        <Link to="/">Noteful</Link>{' '}
                        <FontAwesomeIcon icon="check-double" />
                    </h1>
                </header>
                <main className="App__main">{this.renderMainRoutes()}</main>
            </div>
        );
    }
}

export default App;