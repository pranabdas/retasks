import React from "react";
import { Link } from "@reach/router";

class NotFound extends React.Component {
  render() {
    return (
      <div className="container mt-5 text-center">
        The page you have requested could not be found. Go to{" "}
        <Link to="/">homepage</Link>.
      </div>
    );
  }
}

export default NotFound;
