import React from "react";
import { Link } from "@reach/router";

import FormError from "./FormError";
import firebase from "./Firebase";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      email: "",
      passOne: "",
      passTwo: "",
      errorMessage: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleRegistration = this.handleRegistration.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      this.state.passTwo &&
        (this.state.passTwo !== this.state.passOne
          ? this.setState({ errorMessage: "The passwords do not match!" })
          : this.setState({ errorMessage: null }));
    });
  }

  handleRegistration(e) {
    e.preventDefault();

    if (this.state.passOne === this.state.passTwo) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.passOne)
        .then(() => {
          this.props.registerUser(this.state.user);
        })
        .catch((error) => {
          error.message
            ? this.setState({ errorMessage: error.message })
            : this.setState({ errorMessage: null });
        });
    } else {
      this.setState({ errorMessage: "Please type confirmation password same as original password." })
    }
  }

  render() {
    return (
      <div className="container">
        <h1 className="text-center">Signup for an account</h1>
        <p className="text-center">
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
        <form
          className="row justify-content-center"
          onSubmit={this.handleRegistration}
        >
          <div className="card bg-light col-lg-8">
            <div className="card-body">
              <section className="col-sm-12 form-group">
                {this.state.errorMessage && (
                  <FormError message={this.state.errorMessage} />
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
                  value={this.state.user}
                  onChange={this.handleChange}
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
                  value={this.state.email}
                  onChange={this.handleChange}
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
                  value={this.state.passOne}
                  onChange={this.handleChange}
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
                  value={this.state.passTwo}
                  onChange={this.handleChange}
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
}

export default Register;
