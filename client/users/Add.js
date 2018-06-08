import React, { Component } from 'react'
import Form from './components/Form'

class usersAdd extends Component {
    constructor (props) {
        super(props)
    }

    render() {
        return (
            <div>
                <h1>Add user</h1>
                <Form purpose='createUser' navigateTo={this.props.history.push}/>
            </div>
        );
    }
}

export default usersAdd;