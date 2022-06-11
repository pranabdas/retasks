import { useState } from "react";
import { Link, navigate } from "@reach/router";
import FormError from "./FormError";
import firebase from "./Firebase";

function Login() {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  }

  const handleLogin = (e) => {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(state.email, state.password)
      .then(() => {
        navigate("/home");
      })
      .catch((error) => {
        error.message
          ? setState({ ...state, errorMessage: error.message })
          : setState({ ...state, errorMessage: null });
      });
  }

  return (
    <div className="container">
      <h1 className="text-center">Login</h1>
      <p className="text-center">
        Do not have an account yet? Register a new account {" "}
        <Link to="/register">here</Link>.
      </p>

      <form
        className="row justify-content-center"
        onSubmit={handleLogin}
      >
        <div className="card bg-light col-lg-8">
          <div className="card-body">
            <section className="col-sm-12 form-group">
              {state.errorMessage && (
                <FormError message={state.errorMessage} />
              )}
              <label className="form-control-label" htmlFor="email">
                Email address:
              </label>
              <input
                className="form-control"
                type="email"
                id="email"
                placeholder="name@example.com"
                name="email"
                required
                value={state.email}
                onChange={handleChange}
              />

              <br />
              <label className="form-control-label" htmlFor="password">
                Password:
              </label>
              <input
                className="form-control"
                type="password"
                id="password"
                placeholder="Password"
                name="password"
                required
                value={state.password}
                onChange={handleChange}
              />

              <div className="form-group text-right mt-3">
                <button className="btn btn-primary" type="submit">
                  Login
                </button>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
