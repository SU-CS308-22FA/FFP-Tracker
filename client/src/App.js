import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import EditUser from "./pages/EditUser";

function App() {
  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="users">
            <Route path=":id" element={<EditUser />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
