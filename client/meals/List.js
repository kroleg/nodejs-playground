import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import DateTime from 'react-datetime'

class List extends Component {
    constructor (props) {
        super(props)
        this.state = {
            meals: [],
            dateFrom: moment().subtract(6, 'days'),
            dateTo: moment(),
            timeFrom: moment(),
            timeTo: moment(),
            useTimeFilter: false,
        }
        this.onFiltersChange = this.onFiltersChange.bind(this)
        this.onFiltersTimeSelect = this.onFiltersTimeSelect.bind(this)
        this.searchMeals = this.searchMeals.bind(this)
        this.deleteMeal = this.deleteMeal.bind(this)
        this.userId = this.props.match.params.userId || 'me'
        this.apiBaseUrl = `/api/users/${this.userId}/meals`
        this.baseUrl = this.userId === 'me' ? '/meals' : `/users/${this.userId}/meals`
    }

    render() {
        const uniqueDates = [];
        const mealsByDay = {};
        this.state.meals.forEach(m => {
            if (!uniqueDates.includes(m.date)) {
                uniqueDates.push(m.date);
            }
            if (!mealsByDay[m.date]) {
                mealsByDay[m.date] = { meals: [] }
            }
            mealsByDay[m.date].meals.push(m)
        })
        uniqueDates.sort((a, b) => b - a) // sor desc
        for (let date of Object.keys(mealsByDay)) {
            const dayCalories = mealsByDay[date].meals.reduce((sum, m) => sum + m.calories, 0)
            mealsByDay[date].overEaten = dayCalories > this.props.caloriesPerDay
        }
        const mealsList = uniqueDates.map(date => {
            return <DayOfMeals
                key={date}
                meals={mealsByDay[date].meals}
                date={date}
                overEaten={mealsByDay[date].overEaten}
                deleteMeal={this.deleteMeal}
                baseUrl={this.baseUrl}
                colorDay={!this.state.useTimeFilter && this.props.caloriesPerDay > 0}
            />
        })
        return (
            <div>
                <h1>Meals <Link to={this.baseUrl + '/add'}><small>Add</small></Link></h1>
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
                <div className="meals-list">
                    {mealsList}
                </div>

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
        return fetch(this.apiBaseUrl + (qs ? '?' + qs : ''), { credentials: "same-origin" })
            .then(res => {
                if (res.status === 403) {
                    throw new Error('auth')
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
                    // this.props.history.push('/login')
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
        return fetch(this.apiBaseUrl, { credentials: "same-origin" })
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
        return fetch(`${this.apiBaseUrl}/${mealId}`, { credentials: "same-origin", method: 'DELETE' })
            .then(
                () => {
                    const meals = this.state.meals;
                    const index = meals.findIndex(m => m._id === mealId);
                    meals.splice(index, 1)
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

class DayOfMeals extends React.Component {
    render () {
        const dateFormatted = moment(this.props.date).format('MMM Do')
        const containerClass = this.props.colorDay ? this.props.overEaten ? 'day-fail' : 'day-ok' : ''
        return (
            <div className={containerClass}>
                <div className='day-date'>{dateFormatted}</div>
                <table>
                    <tbody>
                    { this.props.meals.map(m => (
                        <tr key={m.time + m.date}>
                            <td>{moment(m.time + m.date).format('H:m')}</td>
                            <td>{m.calories}</td>
                            <td>{m.note}</td>
                            <td className='table_actions table_actions--show-on-hover'>
                                <Link to={`${this.props.baseUrl}/${m._id}/edit`}>Edit</Link>
                                <a href='' onClick={() => this.props.deleteMeal(m._id)} className='link-danger'>Delete</a>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default List;