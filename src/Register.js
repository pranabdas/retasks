import { useState, useEffect } from "react";
import { Link } from "@reach/router";

import FormError from "./FormError";
import firebase from "./Firebase";

function Register({ registerUser }) {
  const [state, setState] = useState({
    user: "",
    email: "",
    passOne: "",
    passTwo: "",
    errorMessage: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  }

  useEffect(() => {
    let errorMessage = null;
    if ((state.passTwo !== "") &&
      (state.passTwo !== state.passOne)) {
      errorMessage = "The passwords do not match!"
    }

    setState({ ...state, errorMessage });
  }, [state.passOne, state.passTwo]);

  const handleRegistration = (e) => {
    e.preventDefault();

    if (state.passOne === state.passTwo) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(state.email, state.passOne)
        .then(() => {
          registerUser(state.user);
        })
        .catch((error) => {
          error.message
            ? setState({ ...state, errorMessage: error.message })
            : setState({ ...state, errorMessage: null });
        });
    } else {
      setState({ ...state, errorMessage: "Please type confirmation password same as original password." })
    }
  }

  return (
    <div className="container">
      <h1 className="text-center">Signup for an account</h1>
      <p className="text-center">
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
      <form
        className="row justify-content-center"
        onSubmit={handleRegistration}
      >
        <div className="card bg-light col-lg-8">
          <div className="card-body">
            <section className="col-sm-12 form-group">
              {state.errorMessage && (
                <FormError message={state.errorMessage} />
              )}

              <label className="form-control-label" htmlFor="user">
                Name:
              </label>
              <input
                className="form-control"
                type="text"
                id="user"
                placeholder="Your name"
                name="user"
                required
                value={state.user}
                onChange={handleChange}
              />

              <br />
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
              <label className="form-control-label" htmlFor="passOne">
                Password:
              </label>
              <input
                className="form-control"
                type="password"
                id="passOne"
                placeholder="Password"
                name="passOne"
                required
                value={state.passOne}
                onChange={handleChange}
              />

              <br />
              <label className="form-control-label" htmlFor="passTwo">
                Confirm password:
              </label>
              <input
                className="form-control"
                type="password"
                id="passTwo"
                placeholder="Retype password"
                name="passTwo"
                required
                value={state.passTwo}
                onChange={handleChange}
              />

              <div className="form-group text-right mt-3">
                <button className="btn btn-primary" type="submit">
                  Register
                </button>
              </div>
            </section>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
