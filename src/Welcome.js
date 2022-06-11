import { Link } from "react-router-dom";

function Welcome({ user }) {
    return (
      <div className="container text-justified">
        <h1 className="text-center mt-3">ReTasks</h1>
        <p className="lead mt-3">
          This app helps you remember and manage your tasks. You are required to
          have an account in order to use this app. Your account data is hosted
          in Google Firebase. Please use a unique password (that you should not
          share with another app or service) for this app so that your other
          accounts will not be affected in case the security model of this app
          is ever compromised. Want to improve this app, or interested in how it
          works? Visit the project at{" "}
          <a href="https://github.com/pranabdas/retasks">GitHub</a>.
        </p>

        {user ? (
          <div className="text-center">
            <Link to="/home" className="btn btn-primary">
              Show Task List
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <Link to="/login" className="btn btn-primary me-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary me-3">
              Register
            </Link>
          </div>
        )}
      </div>
    );
}

export default Welcome;
