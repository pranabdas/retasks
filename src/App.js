import React from "react";
import { Router, navigate } from "@reach/router";

import firebase from "./Firebase";
import Navigation from "./Navigation";
import Welcome from "./Welcome";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import NotFound from "./404";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      user: "", // this is the display name
      toDoList: [], // if a state is not initialized,
    }; // results undefined error during initial render
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((FBUser) => {
      if (FBUser) {
        this.setState({
          user: FBUser.displayName,
          userID: FBUser.uid,
        });

        const toDoRef = firebase.database().ref("ToDo/" + FBUser.uid);

        toDoRef.on("value", (snapshot) => {
          let data = snapshot.val();
          let toDoList = [];

          for (let item in data) {
            toDoList.push({
              id: item,
              item: data[item].item,
              lastUpdated: data[item].lastUpdated,
              completed: data[item].completed,
            });
          }

          toDoList.sort((a, b) => b.lastUpdated - a.lastUpdated);

          this.setState({ toDoList: toDoList });
        });
      } else {
        this.setState({
          user: "",
          userID: "",
        });
      }
    });
  }

  registerUser = (user) => {
    firebase.auth().onAuthStateChanged((FBUser) => {
      FBUser.updateProfile({
        displayName: user,
      }).then(() => {
        this.setState({
          user: FBUser.displayName,
          userID: FBUser.uid,
        });
        navigate("/home");
      });
    });
  };

  logOutUser = (e) => {
    e.preventDefault();
    this.setState({
      user: "",
      userID: "",
    });

    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate("/login");
      });
  };

  addToDo = (item) => {
    const ref = firebase.database().ref(`ToDo/${this.state.userID}`);
    const date = new Date();
    const lastUpdated = date.getTime();
    ref.push({ item: item, lastUpdated: lastUpdated, completed: false });
  };

  render() {
    return (
      <>
        <Navigation user={this.state.user} logOutUser={this.logOutUser} />
        <Router>
          <Welcome path="/" user={this.state.user} />
          <Register path="/register" registerUser={this.registerUser} />
          <Login path="/login" />
          <Home
            path="/home"
            user={this.state.user}
            addToDo={this.addToDo}
            toDoList={this.state.toDoList}
            userID={this.state.userID}
          />
          <NotFound default />
        </Router>
        <footer className="mt-5">
          Made with <span className="love">♥</span> by {" "}
          <a href="https://pranabdas.github.io/">Pranab</a>.
        </footer>
      </>
    );
  }
}

export default App;
