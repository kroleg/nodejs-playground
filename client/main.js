import { BrowserRouter, Route } from 'react-router-dom'
import ReactDOM from "react-dom";
import React from 'react'
import { Link } from 'react-router-dom'
// import RoomsAndGuests from './pages/Login'
import Signup from './pages/Signup'
import Login from './pages/Login'
import MealsList from './meals/List'
import MealsAdd from './meals/Add'
import MealsEdit from './meals/Edit'
import Settings from './pages/Settings'
// import Photos from './pages/Photos'
// import Navigation from './partials/Navigation'

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            caloriesPerDay: 0
        }
        this.onSettingsUpdate = this.onSettingsUpdate.bind(this)
    }

    render () {
        return (<div>
            <Route path='/' component={Navigation}/>
            <main>
                <Route exact path='/signup' component={Signup}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/meals' render={props => <MealsList caloriesPerDay={this.state.caloriesPerDay} {...props} />} />
                <Route exact path='/meals/add' component={MealsAdd}/>
                <Route exact path='/meals/:mealId/edit' component={MealsEdit}/>
                <Route exact path='/settings' render={props => <Settings onUpdate={this.onSettingsUpdate} {...props} />}/>
            </main>
        </div>)
    }

    componentDidMount() {
        fetch('/api/users/me/settings', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            credentials: "same-origin",
        }).then(res => {
            if (res.status === 200) {
                return res.json()
            }
            else {
                console.error(res.status)
            }
            // todo this.props.history.push('/login')
        }).then(settings => {
            this.setState({ caloriesPerDay: settings.caloriesPerDay })
        });
    }

    onSettingsUpdate(settings) {
        this.setState({ caloriesPerDay: settings.caloriesPerDay })
    }
}
class Navigation extends React.Component {
    render () {
        return (
            <nav className="navbar-light bg-light">
                <Link to='/meals'>Meals</Link>
                <Link to='/settings'>Settings</Link>
            </nav>
        )
    }
}


// function routes() {
//     const result = [];
//     navItems.forEach(group => {
//         group.items.forEach(item => {
//             if (item.comp) {
//                 result.push(item)
//             }
//         })
//     })
//     return result
// }


ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('app'))