// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css'
// import Login from './pages/login'
// import Topics from './pages/topics'
// import TopicDetail from './pages/TopicDetail'
// import AutocompleteHint from './components/search_autocomplete';

// function App() {

//   return (
//     <Router>
//       <header className='header'>
//         <img className='logo' src="/forum.png" alt="" />  
//         <AutocompleteHint />
//       </header>
//       <Routes>
//         {/* Login Route */}
//         <Route path="/login" element={<Login />} />
          
//         {/* Topics Route */}
//         <Route path="/topics" element={<Topics />} />

//         {/* Topic detail route */}
//         <Route path="/topic/:topicId" element={<TopicDetail />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;



import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Topics from './components/Topics';
import './App.css'; 

const App = () => {
    return (
        <div className="app-container">
            <Header />
            <div className="main-content">
                <Sidebar />
                <Routes>
                    {/* <Route path="/topic/:id" component={Topics} /> Route for individual topic */}
                    <Route path="/" exact>
                      {/* Topics Route */}
                      <Route path="/" element={<Topics />} />
                    </Route>
                </Routes>
            </div>
        </div>
    );
};



export default App;