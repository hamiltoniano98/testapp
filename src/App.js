import { Route,Routes,BrowserRouter } from "react-router-dom";
import ShowTask from './components/showtask'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ShowTask></ShowTask>}></Route>
      </Routes>
    
    </BrowserRouter>
  );
}

export default App;
