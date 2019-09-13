import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddNote from '../AddNote/AddNote';

import { getNotesForFolder, findNote, findFolder } from '../notes-helpers';
import './App.css';
import UserContext from '../UserContext';

class App extends Component {
    state = {
        notes: [],
        folders: [],
        newFolderName: null,
        newNote: {
            name: '',
            modified: new Date(),
            content: ''
        }
    };


    //this.setState(this.state.notes.filter((noteId) =>
    //noteId !== jsonfunction 
    //))
    deleteNote = (noteId) => {
        console.log('deleteNote in Apps working', noteId)
        return (
            fetch(`http://localhost:9090/notes/${noteId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'content-type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(this.setState({ notes: this.state.notes.filter(note => note.id !== noteId) }))
        )
    }
    componentDidMount() {

        Promise.all([
            fetch(`http://localhost:9090/notes`),
            fetch(`http://localhost:9090/folders`)
        ])
            .then(([responseNote, responseFolder]) =>
                Promise.all([responseNote.json(), responseFolder.json()])
                    .then(([notes, folders]) => this.setState({ notes, folders }))
            )
    }

    updateNewFolder = (e) => {
        console.log('updateNewFolder firing')
        this.setState({
            newFolderName: e.target.value
        })
    }

    addFolder = (e) => {
        e.preventDefault();
        const body = JSON.stringify({ name: this.state.newFolderName });
        fetch(`http://localhost:9090/folders`, {
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
        console.log(e.target.value)
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
                name: this.state.newNote.name,
                modified: this.state.newNote.modified,
                content: this.state.newNote.content
            }
        )
        fetch(`http://localhost:9090/notes`, {
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
                                />
                            )}
                        />
                    ))}
                    <Route
                        path="/note/:noteId"
                        render={routeProps => {
                            const { noteId } = routeProps.match.params;
                            const note = findNote(notes, noteId) || {};
                            const folder = findFolder(folders, note.folderId);
                            return <NotePageNav
                                newNote={newNote}
                                {...routeProps}
                                folder={folder}
                                routeProps={this.routeProps}
                            />;
                        }}
                    />
                    <Route path="/add-folder" component={NotePageNav} />
                    <Route
                        path="/add-note"
                        render={() => 
                            <AddNote
                                updateNewNote={this.updateNewNote}
                                newNote={newNote}
                                addNote={this.addNote}
                            />
                        }
                    />
                </UserContext.Provider>
            </>
        );
    }

    renderMainRoutes() {
        const { notes, folders } = this.state;
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
                                    folderId
                                );
                                return (
                                    <NoteListMain
                                        {...routeProps}
                                        notes={notesForFolder}
                                        deleteNote={this.deleteNote}

                                    />
                                );
                            }}
                        />
                    ))}
                    <Route
                        path="/note/:noteId"
                        render={routeProps => {
                            const { noteId } = routeProps.match.params;
                            const note = findNote(notes, noteId);
                            return <NotePageMain {...routeProps} note={note} deleteNote={this.deleteNote} />;
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