import React, { Component } from 'react'
import Form from './components/Form'

class UsersEdit extends Component {
    constructor (props) {
        super(props)
        this.userId = window.location.pathname.match(/users\/(.*)+\/edit/)[1]
    }

    render() {
        return (
            <div>
                <h1>Edit user</h1>
                <Form purpose='updateUser' userId={this.userId} navigateTo={this.props.history.push}/>
            </div>
        );
    }
}

export default UsersEdit;