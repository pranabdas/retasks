import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

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
  });
  const [toDoList, setToDoList] = useState([]);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  // there is memory leak, need to unsubscribe unmounted components
  useEffect(() => {
    firebase.auth().onAuthStateChanged((FBUser) => {
      if (FBUser) {
        setState({
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
          setToDoList(toDoList);
          setUpdating(false);
        });
      } else {
        setState({
          user: null,
          userID: null,
        });
        setToDoList([]);
      }
    });
  }, [updating]);

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

    setUpdating(true);
  };

  return (
    <>
      <Navigation user={state.user} logOutUser={logOutUser} />
      <Routes>
        <Route path="/" element={<Welcome user={state.user} />} />
        <Route
          path="/register"
          element={<Register registerUser={registerUser} />}
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            <Home
              user={state.user}
              addToDo={addToDo}
              toDoList={toDoList}
              userID={state.userID}
              setUpdating={setUpdating}
            />
          }
        />
        <Route path="*" element={<NotFound default />} />
      </Routes>
      <footer className="mt-5">
        Made with <span className="love">♥</span> by{" "}
        <a href="https://pranabdas.github.io/">Pranab</a>.
      </footer>
    </>
  );
}

export default App;
