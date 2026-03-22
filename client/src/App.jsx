import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import ViewAssets from "./pages/Assets/ViewAssets";
import ViewAssetsBooking from "./pages/Assets/ViewAssetsBooking";
import ViewPayments from "./pages/Assets/ViewPayments";
import ViewProjects from "./pages/Projects/ViewProjects";
import ViewProjectDetails from "./pages/Projects/ViewProjectDetails";
import ViewProjectPayments from "./pages/Projects/ViewProjectPayments";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Test from "./pages/Test";
import ViewBookingdetails from "./pages/Assets/ViewBookingdetails";
import Dashboard from "./pages/Dashboard/Dashboard";
import Analytics from "./pages/Analytics/Analytics";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/assets" element={<ViewAssets />} />
          <Route path="/assets/rental" element={<ViewAssetsBooking />} />
          <Route path="/assets/rental/:id" element={<ViewBookingdetails />} />
          <Route path="/assets/payments" element={<ViewPayments />} />


          <Route path="/projects" element={<ViewProjects />} />
          <Route path="/projects/:id" element={<ViewProjectDetails />} />
          <Route path="/projects/payments" element={<ViewProjectPayments />} />



          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

