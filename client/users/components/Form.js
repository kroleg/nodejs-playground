import React, { Component } from 'react'

class Form extends Component {
    constructor (props) {
        super(props)
        this.state = {
            email: '',
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
                { this.renderError() }
                <button type="submit" className="btn btn-primary">{this.props.userId ? 'Update' : 'Add'}</button>
            </form>
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ error: null })

        const data = { email: this.state.email };

        if (event.target.elements.password.value) {
            data.password = event.target.elements.password.value;
        }

        fetch(this.props.submitUrl, {
            method: this.props.submitMethod || 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: "same-origin",
        }).then(async res => {
            if (res.status === 200) {
                this.props.navigateTo('/users')
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