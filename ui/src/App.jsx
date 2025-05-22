import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ViewAll from './pages/ViewAll';
import Search from './pages/Search';
import AddName from './pages/AddName';

export default function App() {
  return (
    <div className="p-4 font-sans">
      <nav className="mb-6 space-x-4 text-blue-600 underline">
        <Link to="/">Home</Link>
        <Link to="/view-all">View All</Link>
        <Link to="/search">Search</Link>
        <Link to="/add">Add Name</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/view-all" element={<ViewAll />} />
        <Route path="/search" element={<Search />} />
        <Route path="/add" element={<AddName />} />
      </Routes>
    </div>
  );
}
