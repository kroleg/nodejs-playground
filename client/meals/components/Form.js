import React, { Component } from 'react'
import DateTime from 'react-datetime'
import moment from 'moment'
import api from '../../api'

class Form extends Component {
    constructor (props) {
        super(props)
        this.state = {
            datetime: moment(),
            calories: 0,
            note: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    render() {
        return (
            <form className={this.props.className} onSubmit={(e) => this.handleSubmit(e)} noValidate>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Time and Date</label>
                    <DateTime value={this.state.datetime} input={false} viewMode={'time'}/>
                </div>
                <div className="form-group">
                    <label>Calories</label>
                    <input type="number" name='calories' className="form-control" placeholder="Calories" onChange={this.handleChange} value={this.state.calories}/>
                </div>
                <div className="form-group">
                    <label>Note</label>
                    <input type="text" name='note' className="form-control" placeholder="Note (optional)" onChange={this.handleChange} value={this.state.note}/>
                </div>
                <button type="submit" className="btn btn-primary">{this.props.mealId ? 'Update' : 'Add'}</button>
            </form>
        );
    }

    handleSubmit(event) {
        event.preventDefault();

        const data = { ...this.state };
        data.date = data.datetime.clone().startOf('day').valueOf()
        data.time = data.datetime - data.date;

        (this.props.mealId ? api.updateMeal(this.props.userId, this.props.mealId, data) : api.createMeal(this.props.userId, data))
            .then(() => this.props.navigateTo('/meals'))
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ [event.target.name]: value });
    }

    componentDidMount() {
        if (this.props.mealId) {
            api.readMeal(this.props.userId, this.props.mealId)
                .then(meal => this.setState(meal))
        }
    }

}

export default Form;