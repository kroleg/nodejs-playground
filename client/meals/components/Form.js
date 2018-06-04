import React, { Component } from 'react'

class Form extends Component {
    constructor (props) {
        super(props)
        this.state = {
            // datetime:
            calories: 0,
            note: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    render() {
        return (
            <form action={this.props.submitUrl} method='POST' className={this.props.className} onSubmit={(e) => this.handleSubmit(e)} noValidate>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Time and Date</label>
                    <input type="email" className="form-control" name='datetime'
                           placeholder="Enter date and time" value={this.state.email} onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                    <label>Calories</label>
                    <input type="number" name='calories' className="form-control" placeholder="Calories" onChange={this.handleChange} value={this.state.calories}/>
                </div>
                <div className="form-group">
                    <label>Note</label>
                    <input type="text" name='note' className="form-control" placeholder="Note (optional)" onChange={this.handleChange} value={this.state.note}/>
                </div>
                <button type="submit" className="btn btn-primary">Add</button>
            </form>
        );
    }


    handleSubmit(event) {
        event.preventDefault();

        fetch('/api/users/me/meals', {
            method: this.props.submitMethod || 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state),
            credentials: "same-origin",
        }).then(() => {
            this.props.history.push('/meals')
        });
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [event.target.name]: value });
    }

    componentDidMount() {
        if (this.props.mealId) {
            return fetch(`/api/users/me/meals/${this.props.mealId}`, { credentials: "same-origin" })
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

}

export default Form;