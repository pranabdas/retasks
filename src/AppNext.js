import { useState, useEffect } from "react";
import { Router, navigate } from "@reach/router";

import firebase from "./Firebase";
import Navigation from "./Navigation";
import Welcome from "./Welcome";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import NotFound from "./404";

function App() {
  const [state, setState] = useState({
    user: null,
    userID: null,
    toDoList: [],
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged((FBUser) => {
      if (FBUser) {
        setState({
          ...state,
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
          setState({ ...state, toDoList: toDoList });
        });
      } else {
        setState({
          user: null,
          userID: null,
          toDoList: [],
        });
      }
    });
  }, [state.toDoList, state.userID])

  const registerUser = (user) => {
    firebase.auth().onAuthStateChanged((FBUser) => {
      FBUser.updateProfile({
        displayName: user,
      }).then(() => {
        setState({
          ...state,
          user: FBUser.displayName,
          userID: FBUser.uid,
        });
        navigate("/home");
      });
    });
  };

  const logOutUser = (e) => {
    e.preventDefault();
    setState({
      ...state,
      user: null,
      userID: null,
    });

    firebase
      .auth()
      .signOut()
      .then(() => {
        navigate("/login");
      });
  };

  const addToDo = (item) => {
    const ref = firebase.database().ref(`ToDo/${state.userID}`);
    const date = new Date();
    const lastUpdated = date.getTime();
    ref.push({ item: item, lastUpdated: lastUpdated, completed: false });
  };

  return (
    <>
      <Navigation user={state.user} logOutUser={logOutUser} />
      <Router>
        <Welcome path="/" user={state.user} />
        <Register path="/register" registerUser={registerUser} />
        <Login path="/login" />
        <Home
          path="/home"
          user={state.user}
          addToDo={addToDo}
          toDoList={state.toDoList}
          userID={state.userID}
        />
        <NotFound default />
      </Router>
      <footer className="mt-5">
        Made with <span className="love">♥</span> by{" "}
        <a href="https://pranabdas.github.io/">Pranab</a>.
      </footer>
    </>
  );
}

export default App;
