import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CircleButton from '../CircleButton/CircleButton'
import './NotePageNav.css'
import UserContext from '../UserContext';
import AddNote from '../AddNote/AddNote';
import { Link } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

export default class NotePageNav extends Component {

  static contextType = UserContext;

  static defaultProps = {
    history: {
      goBack: () => {}
    }
  }

  render() {
    const { folders, notes, history } = this.context;
    // console.log(folders);
    // console.log(notes);
    // console.log(history);
    console.log(this.props);
   return (
      <div className='NotePageNav'>
        <CircleButton
          tag='button'
          role='link'
          onClick={() => this.props.history.goBack()}
          className='NotePageNav__back-button'
        >
          <FontAwesomeIcon icon='chevron-left' />
          <br />
          Back
        </CircleButton>
        {folders && (
          <h3 className='NotePageNav__folder-name'>
            {folders.name}
          </h3>
        )}
        <ErrorBoundary>
          <AddNote 
            updateNewNote={this.props.updateNewNote}
            newNote={this.props.newNote}
            addNote={this.props.addNote}
            onSubmit={() => this.props.history.push('/')}
          />
        </ErrorBoundary>
      </div>
    )
  }
}

