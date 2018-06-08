import React, { Component } from 'react'

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
                <form action='/sessions' method='POST' className={'form-signup'} onSubmit={(e) => this.handleSubmit(e)} noValidate>
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
                </form>
                <p className='login_footnote'>If you don't have an account you can <a href="/signup">signup</a></p>
            </div>
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        fetch('/api/sessions/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state),
            credentials: "same-origin",
        }).then(async res => {
            if (res.status === 200) {
                this.props.onLogin()
                this.props.history.push('/meals')
            } else {
                const respBody = await res.json();
                this.setState({ error: respBody.error })
            }
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [event.target.name]: value });
    }
}

export default Login;