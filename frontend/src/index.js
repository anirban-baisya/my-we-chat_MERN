import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { ChakraProvider } from "@chakra-ui/react"; // import `ChakraProvider` component
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./Context/ChatProvider";

ReactDOM.render(
  /* <React.StrictMode>  */
  /*wrapping  whole of our app in ChatProvider context api , so whatever state we create inside of our context api it gona accessable to whole of our app*/
  <BrowserRouter>
    <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </ChatProvider>
  </BrowserRouter>,
  /*//  </React.StrictMode>  */

  document.getElementById("root")
);
