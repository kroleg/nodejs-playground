import React, { Component } from 'react'
import Form from './components/Form'

class MealsEdit extends Component {
    constructor (props) {
        super(props)
        this.mealId = this.props.match.params.mealId
        this.userId = this.props.match.params.userId || 'me'
    }

    render() {
        return (
            <div>
                <h1>Edit meal</h1>
                <Form userId={this.mealId} mealId={this.mealId} navigateTo={this.props.history.push}/>
            </div>
        );
    }
}

export default MealsEdit;