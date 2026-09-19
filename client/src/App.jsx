import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Feed from "./pages/Feed.jsx";
import Tags from "./pages/Tags.jsx";
import TagPage from "./pages/TagPage.jsx";
import Profile from "./pages/Profile.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import PostEditor from "./pages/PostEditor.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Feed />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/tags" element={<Tags />} />

        <Route path="/tag/:slug" element={<TagPage />} />

        <Route path="/post/:slug" element={<PostDetail />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/editor/new" element={<PostEditor />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/editor/:id" element={<PostEditor />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
