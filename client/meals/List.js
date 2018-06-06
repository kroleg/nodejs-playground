import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import DateTime from 'react-datetime'

class List extends Component {
    constructor (props) {
        super(props)
        this.state = {
            meals: [],
            dateFrom: moment(),
            dateTo: moment(),
            timeFrom: moment(),
            timeTo: moment(),
        }
        this.onFiltersChange = this.onFiltersChange.bind(this)
        this.searchMeals = this.searchMeals.bind(this)
    }

    render() {
        return (
            <div>
                <h1>My meals <Link to='/meals/add'><small>Add</small></Link></h1>
                <Filters
                    dateFrom={this.state.dateFrom}
                    dateTo={this.state.dateTo}
                    timeFrom={this.state.timeFrom}
                    timeTo={this.state.timeTo}
                    onChange={this.onFiltersChange}
                />
                <button type='button' className='btn btn-primary' onClick={this.searchMeals}>Apply filters</button>
                <table>
                    <tbody>
                    <tr><th>Time</th><th>Calories</th><th>Note</th><th></th></tr>
                    { this.state.meals.map(m => (
                        <tr>
                            <td>{moment(m.time + m.date).format('MMM Do, H:m')}</td>
                            <td>{m.calories}</td>
                            <td>{m.note}</td>
                            <td><Link to={`/meals/${m._id}/edit`} className='btn btn-light'>Edit</Link></td>
                            <td><button onClick={() => this.deleteMeal(m._id)} className='btn btn-outline-danger'>Delete</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );
    }

    searchMeals () {
        const query = {
            dateFrom: this.state.dateFrom.clone().startOf('day').valueOf(),
            dateTo: this.state.dateTo.clone().startOf('day').valueOf(),
            timeFrom: this.state.timeFrom - this.state.timeFrom.clone().startOf('day'),
            timeTo: this.state.timeTo - this.state.timeTo.clone().startOf('day'),
        }
        const qs = Object.keys(query).map(key => key + '=' + query[key]).join('&')
        return fetch('/api/users/me/meals' + (qs ? '?' + qs : ''), { credentials: "same-origin" })
            .then(res => {
                if (res.status !== 200) {
                    this.props.history.push('/login')
                }
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({ meals: result.data })
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

    onFiltersChange(prop, newValue) {
        this.setState({ [prop]: newValue })
    }

    componentDidMount() {
        document.title = 'Meals';
        return fetch('/api/users/me/meals', { credentials: "same-origin" })
            .then(res => {
                if (res.status !== 200) {
                    this.props.history.push('/login')
                }
                return res.json()
            })
            .then(
                (result) => {
                    this.setState({ meals: result.data })
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

    deleteMeal(mealId) {
        console.log('del meal', mealId)
        return fetch(`/api/users/me/meals/${mealId}`, { credentials: "same-origin", method: 'DELETE' })
            .then(
                () => {
                    const meals = this.state.meals;
                    const index = meals.findIndex(m => m._id === mealId);
                    meals.splice(index, 1)
                    console.log(index, meals)
                    this.setState({ meals })
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


class Filters extends Component {
    constructor (props) {
        super(props)
        this.dateFormat = 'MMM Do'
        this.timeFormat = 'H:mm'
    }

    render() {
        return (
            <div className='filters'>
                Show meals from {this.renderDateTimePicker('dateFrom')} to {this.renderDateTimePicker('dateTo')}
                eaten between {this.renderDateTimePicker('timeFrom')} and {this.renderDateTimePicker('timeTo')}
            </div>
        )
    }

    renderDateTimePicker (propName) {
        const format = propName.startsWith('date') ? this.dateFormat : this.timeFormat;
        return <DateTime
            timeFormat={propName.startsWith('time')}
            dateFormat={propName.startsWith('date')}
            closeOnSelect={propName.startsWith('date')}
            defaultValue={this.props[propName]}
            renderInput={(props, openCalendar) => <button className='btn btn-link' type='button' onClick={openCalendar}>{this.props[propName].format(format)}</button>}
            onChange={m => this.props.onChange(propName, m)}
        />
    }
}

export default List;