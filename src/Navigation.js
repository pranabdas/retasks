// This is the landing page of this app

import React from "react";
import { Link } from "@reach/router";
import { FcTodoList } from "react-icons/fc";

class Navigation extends React.Component {
  render() {
    const { user, logOutUser } = this.props;
    return (
      <nav className="site-nav family-sans navbar navbar-expand bg-primary navbar-dark higher sticky-top">
        <div className="container">
          <div className="navbar-nav ml-auto">
            <Link to="/" className="navbar-brand">
              <FcTodoList className="mr-1" /> ReTasks
            </Link>
            {user && (
              <>
                <Link className="nav-item nav-link" to="/home">
                  Home
                </Link>
                <Link
                  className="nav-item nav-link"
                  to="/login"
                  onClick={(e) => logOutUser(e)}
                >
                  log out
                </Link>
              </>
            )}
            {!user && (
              <>
                <Link className="nav-item nav-link" to="/register">
                  register
                </Link>

                <Link className="nav-item nav-link" to="/login">
                  log in
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  }
}

export default Navigation;
