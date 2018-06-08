import React, { Component } from 'react'
import api from '../api'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '123456',
            email: 'test@example.com'
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    render() {
        return (
            <div>
                <form className={'form-signup'} onSubmit={this.handleSubmit} noValidate>
                    <h1>Login</h1>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name='email'
                               placeholder="Enter email" value={this.state.email} onChange={this.handleChange}/>
                        <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" name='password' className="form-control" placeholder="Password" onChange={this.handleChange} value={this.state.password}/>
                    </div>
                    { this.state.error ? <div className='alert alert-danger' role="alert">{this.state.error}</div> : ''}
                    <button type="submit" className="btn btn-primary">Login</button>
                    <p className='form_footnote'>If you don't have an account you can <a href="/signup">signup</a></p>
                </form>
            </div>
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        api.login(this.state).then(() => {
            this.props.onLoggedIn()
            this.props.history.push('/meals')
        }, err => {
            this.setState({ error: err.message })
        })
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [event.target.name]: value });
    }
}

export default Login;