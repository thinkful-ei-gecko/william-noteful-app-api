import React, { Component } from 'react'

export default class EditFolder extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       id: '',
       folder_name: ''
    }
  }
  
  componentDidMount() {
    const folderId = this.props.match.params.folderId;
    fetch(`https://tranquil-sands-99231.herokuapp.com/api/folders/${folderId}`, {
      method: 'GET'
    })
      .then(res => {
        if(!res.ok) {
          return Promise.reject('Error, try again');
        }
        return res.json();
      })
      .then(data => {
        this.setState({
          id: data.id,
          folder_name: data.folder_name
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({error})
      })
  }

  handleChange = (e) => {
    this.setState({
      folder_name: e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const folderId = this.props.match.params.folderId;
    const { id, folder_name } = this.state;
    const updatedFolder = { id, folder_name }
    fetch(`https://tranquil-sands-99231.herokuapp.com/api/folders/${folderId}`, {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(updatedFolder)
    })
      .then(res => {
        if(!res.ok) {
          return Promise.reject('Error, try again');
        }
      })
      .then(() => {
        this.props.updateFolder(updatedFolder)
        this.props.history.push('/')
      })
  }

  render() {
    // console.log(this.props)
    const { folder_name } = this.state;
    return(
        <div className="AddFolderform">
            <form onSubmit={e => this.handleSubmit(e)}>
                <label htmlFor="addfoldername" className="add-folder-label"> Add folder name </label>
                    <input type="text" id="addfoldername" name="addfoldername" value={folder_name}
                        onChange={e => this.handleChange(e)}></input>
                <button type="submit" className="edit-folder-button">Edit Folder</button>
            </form>
        </div>
    )
  }
}
