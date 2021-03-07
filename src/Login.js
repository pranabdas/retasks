import React from "react";
import { Link, navigate } from "@reach/router";
import FormError from "./FormError";
import firebase from "./Firebase";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleLogin(e) {
    e.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        navigate("/home");
      })
      .catch((error) => {
        error.message
          ? this.setState({ errorMessage: error.message })
          : this.setState({ errorMessage: null });
      });
  }

  render() {
    return (
      <div className="container">
        <h1 className="text-center">Login</h1>
        <p className="text-center">
          Do not have an account yet? Register a new account {" "}
          <Link to="/register">here</Link>.
        </p>

        <form
          className="row justify-content-center"
          onSubmit={this.handleLogin}
        >
          <div className="card bg-light col-lg-8">
            <div className="card-body">
              <section className="col-sm-12 form-group">
                {this.state.errorMessage && (
                  <FormError message={this.state.errorMessage} />
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
                  value={this.state.email}
                  onChange={this.handleChange}
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
                  value={this.state.password}
                  onChange={this.handleChange}
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
}

export default Login;
