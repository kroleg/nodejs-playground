import React, { Component } from 'react'
import Form from './components/Form'
import { Link } from 'react-router-dom'

class MealsEdit extends Component {
    constructor (props) {
        super(props)
        this.mealId = window.location.pathname.match(/meals\/(.*)+\/edit/)[1]
    }

    render() {
        return (
            <div>
                <Link to='/meals'>&lt; Back to meals list</Link>
                <h1>Edit meal</h1>
                <Form submitUrl={`/api/users/me/meals/${this.mealId}`} submitMethod='PUT' mealId={this.mealId} navigateTo={this.props.history.push}/>
            </div>
        );
    }
}

export default MealsEdit;