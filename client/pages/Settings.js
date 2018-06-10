import React, { Component } from 'react'

class Settings extends Component {
    constructor (props) {
        super(props)
        this.state = {
            caloriesPerDay: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    render() {
        return (
            <div>
                <h1>Settings</h1>
                <form onSubmit={(e) => this.handleSubmit(e)} noValidate>
                    <div className="form-group">
                        <label>Calories per day</label>
                        <input type="text" className="form-control" name='caloriesPerDay'
                               placeholder="Expected number of calories per day" value={this.state.caloriesPerDay} onChange={this.handleChange}/>
                        <small className="form-text text-muted">Set to 0 or negative to disable.</small>
                    </div>
                    <button type="submit" className="btn btn-primary">Save</button>
                </form>
            </div>
        );
    }


    handleSubmit(event) {
        event.preventDefault();

        fetch('/api/users/me', {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ settings: this.state }),
            credentials: "same-origin",
        }).then(() => {
            this.props.onUpdate(this.state)
            this.props.history.goBack()
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [event.target.name]: value });
    }

    componentDidMount() {
        return fetch(`/api/users/me`, {credentials: "same-origin"})
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState(result.settings)
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

export default Settings;