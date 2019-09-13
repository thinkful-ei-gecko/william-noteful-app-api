import React from 'react'
import AddFolderError from './AddFolderError';

export default class Addfolder extends React.Component{
    validateFolderName = () => {
        const name = this.props.newFolderName.trim();
        if(name.length === 0) {
            return 'Please enter a name';
        } else if(name.length < 2) {
            return 'Please enter a foldner name that is longer than 2 characters';
        }
    }

    render() {
        // console.log(this.props)
        let validateFolder = this.validateFolderName();
        return(
            <div className="AddFolderform">
                <form onSubmit={e => this.props.addFolder(e)}>
                    <label htmlFor="addfoldername"> Add folder name </label>
                        <input type="text" id="addfoldername" name="addfoldername" 
                            value={this.props.newFolderName}
                            onChange={e => this.props.updateNewFolder(e)}
                        ></input>
                        <AddFolderError message={validateFolder} />
                    <button type="submit" disabled={validateFolder}>Add Folder</button>
                </form>

            </div>
        )
    }
}