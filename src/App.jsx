import "./App.css";
import { TodoFilter } from "./components/todo-filter";
import { TodoWrapper } from "./components/todo-wrapper";


function App() {
  return (
    <div className="App">
      <hr style={{margin: '15px 0'}}/>
      <TodoWrapper />
      <div>
      <TodoFilter />
      </div>
    </div>
  );
}

export default App;
