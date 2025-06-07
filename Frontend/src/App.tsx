import AppRoutes from "./Routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";

const App = () =>{
  return(
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

          body, html {
            font-family: 'Poppins', sans-serif;
            overflow-x: hidden;  /* Remove horizontal scrollbar */
          }
        `}
      </style>

      <BrowserRouter>
      <AppRoutes/>
      </BrowserRouter>
    </>
  )
}

export default App;
