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

const App = () => (
    <div>
        <main>
            <Route path='/' component={Navigation}/>
            <Route exact path='/signup' component={Signup}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/meals' component={MealsList}/>
            <Route exact path='/meals/add' component={MealsAdd}/>
            <Route exact path='/meals/:mealId/edit' component={MealsEdit}/>
            <Route exact path='/settings' component={Settings}/>
        </main>
    </div>
)

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