import React, { Component } from 'react'
import api from '../../api'

class Form extends Component {
    constructor (props) {
        super(props)
        this.state = {
            email: '',
            role: 'regular',
            settings: {
                caloriesPerDay: 0
            }
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    render() {
        return (
            <form className={this.props.className} onSubmit={(e) => this.handleSubmit(e)} noValidate>
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
                        <option value="admin">Admin (ability to add/update/remove users and their meals)</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Calories per day</label>
                    <input type="text" name='caloriesPerDay' value={this.state.settings.caloriesPerDay}  onChange={e => this.caloriesChange(e)} className="form-control"/>
                </div>
                { this.renderError() }
                <button type="submit" className="btn btn-primary">{this.props.userId ? 'Update' : 'Add'}</button>
            </form>
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ error: null })

        const data = { ...this.state };
        delete data.password

        if (event.target.elements.password.value) {
            data.password = event.target.elements.password.value;
        }

        const work = this.props.userId ? api.updateUser(this.props.userId, data) : api.createUser(data)
        work.then(() => this.props.navigateTo('/users'), err => this.setState({ error: err.message }))
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [event.target.name]: value });
    }

    caloriesChange(event) {
        const newState = { ...this.state }
        newState.settings.caloriesPerDay = event.target.value
        this.setState(newState)
    }

    componentDidMount() {
        if (this.props.userId) {
            api.readUser(this.props.userId).then(user => this.setState(user), err => this.setState({ error: err }))
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