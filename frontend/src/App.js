import { Route } from 'react-router-dom';
import './App.css';
import Homepage from './Pages/Homepage';
import ChatPage from './Pages/ChatPage';
// import { Button } from '@chakra-ui/react';


// Chakra UI is a simple, modular and accessible component library that
// gives you the building blocks you need to build your React applications , it has multipe pre-written component it is similar to bootstrap/Material-ui .
// command to install chakra UI  npm i @chakra-ui/react @emotion/react@^11 @emotion/styled@^11 framer-motion@^6
// And to complete the setup we have to wrap App component using <ChakraProvider> </ChakraProvider> inside index.js


function App() {
  return (
    <div className="App">
     <Route path="/" component={Homepage} exact/> {/*The exact param disables the partial matching for a route and makes sure that it only returns the route if the path is an EXACT match to the current url.  */}
     <Route path="/chats" component={ChatPage} /> {/*witout using exact it will display homepage above route content also*/}

    </div>
  );
}

export default App;
