import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class List extends Component {
    constructor (props) {
        super(props)
        this.state = {
            meals: []
        }
    }

    render() {
        return (
            <div>
                <h1>My meals</h1>
                <Link to='/meals/add'>Add</Link>
                <table>
                    <tbody>
                    <tr><th>Time</th><th>Calories</th><th>Note</th><th>1</th></tr>
                    { this.state.meals.map(m => (
                        <tr>
                            <td>{m.time}</td>
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

    componentDidMount() {
        document.title = 'Meals';
        return fetch('/api/users/me/meals', { credentials: "same-origin" })
            .then(res => res.json())
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

export default List;