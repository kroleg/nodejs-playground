import { BrowserRouter, Route } from 'react-router-dom'
import ReactDOM from "react-dom";
import React from 'react'
import { Link, Redirect } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import MealsList from './meals/List'
import MealsAdd from './meals/Add'
import MealsEdit from './meals/Edit'
import Settings from './pages/Settings'
import UsersList from './users/List'
import UsersEdit from './users/Edit'
import UsersAdd from './users/Add'
import api from './api'

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            caloriesPerDay: 0,
            loggedIn: false,
            checkingLoginStatus: true,
            userRole: 'regular'
        }
        this.onSettingsUpdate = this.onSettingsUpdate.bind(this)
        this.onLogout = this.onLogout.bind(this)
        this.getAuthState = this.getAuthState.bind(this)
    }

    render () {
        if (this.state.checkingLoginStatus) {
            return ''
        }
        return (<div>
            <Route render={props => this.state.loggedIn ? <Navigation allowedRoutes={this.getAllowedRoutes()} onLogout={this.onLogout} {...props} /> : '' } />
            <main>
                <Route exact path='/' render={() => <Redirect to={this.state.loggedIn ? '/meals' : '/login' } /> } />
                <Route exact path='/signup' render={props => this.state.loggedIn ? <Redirect to='/meals'/> : <Signup onRegistered={this.getAuthState} {...props} />}/>
                <Route exact path='/login' render={props => this.state.loggedIn ? <Redirect to='/meals'/> : <Login onLoggedIn={this.getAuthState} {...props} />}/>
                <Route exact path='/meals' render={props => <MealsList caloriesPerDay={this.state.caloriesPerDay} {...props} />} />
                <Route exact path='/meals/add' component={MealsAdd}/>
                <Route exact path='/meals/:mealId/edit' component={MealsEdit}/>
                <Route exact path='/settings' render={props => <Settings onUpdate={this.onSettingsUpdate} {...props} />}/>
                <Route exact path='/users' render={props => <UsersList showMealsLink={this.state.userRole === 'admin'} caloriesPerDay={this.state.caloriesPerDay} {...props} />} />
                <Route exact path='/users/:userId/edit' render={props => <UsersEdit {...props}/>} />
                <Route exact path='/users/add' render={props => <UsersAdd {...props}/>} />
                <Route exact path='/users/:userId/meals' render={props => <MealsList {...props}/>} />
            </main>
        </div>)
    }

    getAuthState() {
        api.getCurrentUser()
            .then(async (user) => {
                this.setState({
                    loggedIn: true,
                    checkingLoginStatus: false,
                    caloriesPerDay: user.settings ? user.settings.caloriesPerDay : null,
                    userRole: user.role,
                })
            }, () => {
                this.setState({ loggedIn: false })
            })
    }

    componentDidMount() {
        this.getAuthState()
    }

    onSettingsUpdate(settings) {
        this.setState({ caloriesPerDay: settings.caloriesPerDay })
    }

    onLogout() {
        this.setState({ loggedIn: false, userRole: 'regular' })
    }

    getAllowedRoutes() {
        const result = [];
        if (this.state.userRole === 'manager' || this.state.userRole === 'admin') {
            result.push('users')
        }
        return result;
    }
}

class Navigation extends React.Component {
    constructor (props) {
        super(props)
        this.clickLogout = this.clickLogout.bind(this)
    }

    render () {
        return (
            <nav className="navbar-light bg-light">
                <Link to='/meals'>Meals</Link>
                <Link to='/settings'>Settings</Link>

                { this.props.allowedRoutes.includes('users') ? <Link to='/users'>Users</Link>  : '' }
                <a href="/logout" onClick={this.clickLogout}>Logout</a>
            </nav>
        )
    }

    clickLogout(event) {
        event.preventDefault()
        fetch('/api/sessions', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
            credentials: "same-origin",
        }).then(() => {
            this.props.onLogout()
            this.props.history.push('/login')
        })
    }
}

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('app'))