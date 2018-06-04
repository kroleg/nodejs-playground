import { BrowserRouter, Route } from 'react-router-dom'
import ReactDOM from "react-dom";
import React from 'react'
// import RoomsAndGuests from './pages/Login'
import Signup from './pages/Signup'
import Login from './pages/Login'
import MealsList from './meals/List'
import MealsAdd from './meals/Add'
import MealsEdit from './meals/Edit'
// import Photos from './pages/Photos'
// import Navigation from './partials/Navigation'

const App = () => (
    <div>
        <main>
            <Route exact path='/signup' component={Signup}/>
            <Route exact path='/login' component={Login}/>
            <Route exact path='/meals' component={MealsList}/>
            <Route exact path='/meals/add' component={MealsAdd}/>
            <Route exact path='/meals/:mealId/edit' component={MealsEdit}/>
        </main>
    </div>
)


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