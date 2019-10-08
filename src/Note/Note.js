import React from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'
import PropTypes from 'prop-types'

export default class Note extends React.Component {
  //static contextType = UserContext

  render() {
    // console.log(this.props);
    return (
      <div className='Note'>
        <h2 className='Note__title'>
          <Link to={`/note/${this.props.id}`}>
            {this.props.name}
          </Link>
        </h2>
        <button className='Note__delete' type='button'
          onClick={() => this.props.deleteNote(this.props.id)}>
          <FontAwesomeIcon icon='trash-alt' />
          {' '}
          remove
        </button>
        <div className='Note__dates'>
          <div className='Note__dates-modified'>
            Modified
            {' '}
            <span className='Date'>
              {format(this.props.modified, 'Do MMM YYYY')}
            </span>
          </div>
        </div>
        <Link to={`/edit/${this.props.id}`}><button type="button">Edit Note</button></Link>
      </div>
    )
  }
}

Note.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  modified: PropTypes.string,
  deleteNote: PropTypes.func.isRequired
}