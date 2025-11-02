import { Login } from "./features/login/pages/login"
import { Register } from "./features/register/pages/Register";
import { NotFound } from "./features/not-found/pages/NotFound";
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/sign-in" element={<Register />}/>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  )
}

export default App
