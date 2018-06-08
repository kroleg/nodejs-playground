import React, { Component } from 'react'
import api from '../api'

class Signup extends Component {

    constructor (props) {
        super(props)
        this.state = {
            error: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    render() {
        return (
            <form onSubmit={e => this.handleSubmit(e)}>
                <h1>Signup</h1>
                <div className="form-group">
                    <label>Email address</label>
                    <input type="email" className="form-control" placeholder="Enter email" name='email' defaultValue='test@example.com'/>
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" className="form-control" placeholder="Enter password"  name='password' defaultValue='123456'/>
                </div>
                { this.state.error ? <div className='alert alert-danger' role="alert">{this.state.error}</div> : ''}
                <button type="submit" className="btn btn-primary">Submit</button>
                <p className='form_footnote'>Already have an account? <a href="/login">Sign in</a></p>
            </form>
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = {
            password: event.target.elements.password.value,
            email: event.target.elements.email.value,
        }
        api.createUser(data)
            .then(() => api.login(data))
            .then(() => this.props.onRegistered())
            .catch(err => this.setState({ error: err.message }))

    }
}

export default Signup;