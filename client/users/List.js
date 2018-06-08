import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class List extends Component {
    constructor (props) {
        super(props)
        this.state = {
            users: [],
        }
    }

    render() {
        return (
            <div>
                <h1>Users <Link to='/users/add'><small>Add</small></Link></h1>
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
        return fetch('/api/users', { credentials: "same-origin" })
            .then(res => {
                if (res.status !== 200) {
                    // this.props.history.push('/login')
                    //todo show error. possible codes 401 = no rights, 403 = no auth
                }
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({ users: result })
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    clickDelete(user, event) {
        event.preventDefault()
        if (!confirm(`Are you sure want to delete user ${user.email}?`)) {
            return
        }
        const userId = user._id
        return fetch(`/api/users/${userId}`, { credentials: "same-origin", method: 'DELETE' })
            .then(
                () => {
                    const users = this.state.users;
                    const index = users.findIndex(m => m._id === userId);
                    users.splice(index, 1)
                    this.setState({ users })
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
}

export default List;