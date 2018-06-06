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
            useTimeFilter: false,
        }
        this.onFiltersChange = this.onFiltersChange.bind(this)
        this.onFiltersTimeSelect = this.onFiltersTimeSelect.bind(this)
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
                    useTimeFilter={this.state.useTimeFilter}
                    onChangeFilterTime={this.onFiltersTimeSelect}
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
        }
        if (this.state.useTimeFilter) {
            query.timeFrom = this.state.timeFrom - this.state.timeFrom.clone().startOf('day')
            query.timeTo = this.state.timeTo - this.state.timeTo.clone().startOf('day')
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

    onFiltersTimeSelect(newValue) {
        this.setState({ useTimeFilter: !!newValue })
        if (newValue === 'breakfast') {
            const bfStart = moment().hours(9).minutes(0).seconds(0).milliseconds(0);
            const bfEnd = bfStart.clone().hours(11)
            this.setState({ timeFrom: bfStart, timeTo: bfEnd })
        } else if (newValue === 'lunch') {
            const bfStart = moment().hours(12).minutes(0).seconds(0).milliseconds(0);
            const bfEnd = bfStart.clone().hours(15)
            this.setState({ timeFrom: bfStart, timeTo: bfEnd })
        }
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
        this.timeSelectChange = this.timeSelectChange.bind(this)
    }

    render() {
        return (
            <div className='filters'>
                Dates: {this.renderDateTimePicker('dateFrom')} to {this.renderDateTimePicker('dateTo')} <br/>
                <select onChange={this.timeSelectChange} defaultValue={this.props.useTimeFilter === false ? 'no' : 'yes' }>
                    <option value="no">Any time</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="yes">Specified time</option>
                </select>
                {this.props.useTimeFilter ? <span>{this.renderDateTimePicker('timeFrom')} to {this.renderDateTimePicker('timeTo')}</span> : '' }
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

    timeSelectChange (event) {
        const val = event.target.value
        if (val === 'no') {
            this.props.onChangeFilterTime(false)
        } else if (val === 'yes') {
            this.props.onChangeFilterTime(true)
        } else {
            this.props.onChangeFilterTime(val)
        }
    }
}

export default List;