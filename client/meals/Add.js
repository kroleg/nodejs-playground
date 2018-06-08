import React, { Component } from 'react'
import Form from './components/Form'

class MealsAdd extends Component {
    constructor (props) {
        super(props)
        this.userId = this.props.match.params.userId || 'me'
    }

    render() {
        return (
            <div>
                <h1>Add meal</h1>
                <Form userId={this.userId} navigateTo={this.props.history.push}/>
            </div>
        );
    }
}

export default MealsAdd;