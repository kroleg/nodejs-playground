import React, { Component } from 'react'
import api from '../../api'

class Form extends Component {
    constructor (props) {
        super(props)
        this.state = {
            email: '',
            role: 'regular'
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    render() {
        return (
            <form action={this.props.submitUrl} method='POST' className={this.props.className} onSubmit={(e) => this.handleSubmit(e)} noValidate>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name='email' className="form-control" placeholder="Email" onChange={this.handleChange} value={this.state.email}/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name='password' className="form-control" placeholder={ this.props.userId ? 'Enter password to change it' : 'Password'}/>
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select name="role" className='form-control' value={this.state.role} onChange={this.handleChange}>
                        <option value="regular">Regular user</option>
                        <option value="manager">Manager (ability to add/update/remove users)</option>
                        <option value="manager">Admin (ability to add/update/remove users and their meals)</option>
                    </select>
                </div>
                { this.renderError() }
                <button type="submit" className="btn btn-primary">{this.props.userId ? 'Update' : 'Add'}</button>
            </form>
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ error: null })

        const data = { email: this.state.email, role: this.state.role };

        if (event.target.elements.password.value) {
            data.password = event.target.elements.password.value;
        }

        let work;
        if (this.props.purpose === 'createUser') {
            work = api.createUser(data)

        } else if (this.props.purpose === 'updateUser') {
            work = api.updateUser(this.props.userId, data)
        } else {
            console.error('Form has incorrect purpose:', this.props.purpose)
            return
        }

        work.then(() => this.props.navigateTo('/users'))
            .catch(err => this.setState({ error: err.message }))
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [event.target.name]: value });
    }

    componentDidMount() {
        if (this.props.userId) {
            return fetch(`/api/users/${this.props.userId}`, { credentials: "same-origin" })
                .then(res => res.json())
                .then(
                    (result) => {
                        this.setState(result)
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

    renderError () {
        if (!this.state.error) {
            return ''
        }
        return <div className='alert alert-danger' role="alert">{this.state.error}</div>
    }
}

export default Form;