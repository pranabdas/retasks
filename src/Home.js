import { useState } from "react";
import firebase from "./Firebase";
import ToDoItem from "./ToDoItem";

function Home({ user, toDoList, addToDo, userID }) {
  const [state, setState] = useState({
    item: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  }

  const addItem = (e) => {
    e.preventDefault();
    addToDo(state.item);
    setState({
      ...state,
      item: "",
    });
  }

  const deleteItem = (e, id) => {
    e.preventDefault();
    const ref = firebase.database().ref(`ToDo/${userID}/${id}`);
    ref.remove();
  }

  // if use arrow function, do not need to bind in the constructor
  const handleChecked = (e, id) => {
    e.preventDefault();
    const ref = firebase.database().ref(`ToDo/${userID}/${id}`);
    const date = new Date();
    const lastUpdated = date.getTime();
    let updatedItem = toDoList.filter((item) => {
      return item.id === id;
    });

    updatedItem = updatedItem[0];

    // updating existing item with the same key, does not re-render the
    // checkbox, work around: use random key, or create new item
    ref.set({
      completed: !updatedItem.completed,
      item: updatedItem.item,
      lastUpdated: lastUpdated,
    });

    //   ref.remove();
    //   const newRef = firebase.database().ref(`ToDo/${this.state.userID}`);
    //   newRef.push({
    //     completed: !updatedItem.completed,
    //     item: updatedItem.item,
    //     lastUpdated: lastUpdated,
    //   });
  };

  const unCheckedList = toDoList.filter((item) => {
    return item.completed === false;
  });

  const checkedList = toDoList.filter((item) => {
    return item.completed === true;
  });

  return (
    <div className="container">
      <h1 className="text-center">Welcome {user}</h1>
      <form className="row justify-content-center" onSubmit={addItem}>
        <div className="card bg-light col-lg-8">
          <div className="card-body">
            <section className="col-sm-12 form-group">
              <label htmlFor="item" className="form-control-label">
                Add new task :
              </label>
              <input
                type="text"
                name="item"
                id="item"
                required
                placeholder="What do you want to accomplish?"
                value={state.item}
                onChange={handleChange}
                className="form-control"
              ></input>
              <div className="form-group text-right mt-3">
                <button
                  type="submit"
                  className="btn btn-sm btn-info"
                  id="buttonAdd"
                >
                  + Add task
                </button>
              </div>
            </section>
          </div>
        </div>
      </form>

      {unCheckedList.length ? (
        <h3 className="text-center mt-3">
          Tasks ({unCheckedList.length})
        </h3>
      ) : null}

      {unCheckedList.map((item) => (
        <ToDoItem
          id={item.id}
          item={item.item}
          key={item.id} // without key change, checkbox does not toggle
          // key={Math.random()}
          completed={item.completed}
          handleChecked={handleChecked}
          deleteItem={deleteItem}
        />
      ))}

      {checkedList.length ? (
        <h3 className="text-center mt-3">
          Completed ({checkedList.length})
        </h3>
      ) : null}
      {checkedList.map((item) => (
        <ToDoItem
          id={item.id}
          item={item.item}
          key={item.id} // without key change, checkbox does not toggle
          // key={Math.random()}
          completed={item.completed}
          handleChecked={handleChecked}
          deleteItem={deleteItem}
        />
      ))}
    </div>
  );
}

export default Home;
