import "./css/App.css";
import { useNavigate } from "react-router-dom";
import CommonHeader from "./common/commonHeader";
import Dashboard from "./pages/dashboard";

function App() {
  const navigate = useNavigate();

  return (
    <div className="App">
      <CommonHeader />
      <Dashboard />
    </div>
  );
}

export default App;
