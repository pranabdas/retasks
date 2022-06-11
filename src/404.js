import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container mt-5 text-center">
      The page you have requested could not be found. Go to{" "}
      <Link to="/">homepage</Link>.
    </div>
  );
}

export default NotFound;
