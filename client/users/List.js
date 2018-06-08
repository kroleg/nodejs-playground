import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

class List extends Component {
    constructor (props) {
        super(props)
        this.state = {
            users: [],
            error: null
        }
    }

    render() {
        return (
            <div>
                <h1>Users <Link to='/users/add'><small>Add</small></Link></h1>
                { this.state.error ? <div className='alert alert-danger'>{this.state.error}</div> : '' }
                <table className='table'>
                    <tbody>
                        <tr><th>ID</th><th>Email</th><th>Role</th><th>Actions</th></tr>
                    { this.state.users.map(user => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td className='table_actions'>
                                {this.props.showMealsLink ? <Link to={`/users/${user._id}/meals`}>View meals</Link> : ''}
                                <Link to={`/users/${user._id}/edit`}>Edit</Link>
                                <a href='#' onClick={this.clickDelete.bind(this, user)} className='link-danger'>Delete</a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }

    componentDidMount() {
        document.title = 'Users';
        api.listUsers()
            .then(users => {
                this.setState({ users })
            }, err => {
                this.setState({ error: err.message, users: [] })
            })
    }

    clickDelete(user, event) {
        event.preventDefault()
        if (!confirm(`Are you sure want to delete user ${user.email}?`)) {
            return
        }
        return api.deleteUser(user._id)
            .then(() => {
                const users = this.state.users;
                const index = users.findIndex(m => m._id === user._id);
                users.splice(index, 1)
                this.setState({ users })
            }, err => this.setState({ error: err.message }))
    }
}

export default List;