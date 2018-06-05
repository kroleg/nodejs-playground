import React, { Component } from 'react'
import Form from './components/Form'
import { Link } from 'react-router-dom'

class MealsAdd extends Component {
    constructor (props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Link to='/meals'>&lt; Back to meals list</Link>
                <h1>Add meal</h1>
                <Form submitUrl='/api/users/me/meals' navigateTo={this.props.history.push}/>
            </div>
        );
    }
}

export default MealsAdd;