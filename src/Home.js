import React from "react";
import firebase from "./Firebase";

import ToDoItem from "./ToDoItem";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      item: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  addItem(e) {
    e.preventDefault();
    this.props.addToDo(this.state.item);
    this.setState({
      item: "",
    });
  }

  deleteItem(e, id) {
    e.preventDefault();
    const ref = firebase.database().ref(`ToDo/${this.props.userID}/${id}`);
    ref.remove();
  }

  // if use arrow function, do not need to bind in the constructor
  handleChecked = (e, id) => {
    e.preventDefault();
    const ref = firebase.database().ref(`ToDo/${this.props.userID}/${id}`);
    const date = new Date();
    const lastUpdated = date.getTime();
    let updatedItem = this.props.toDoList.filter((item) => {
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

  render() {
    const { user, toDoList } = this.props;

    const unCheckedList = toDoList.filter((item) => {
      return item.completed === false;
    });

    const checkedList = toDoList.filter((item) => {
      return item.completed === true;
    });

    return (
      <div className="container">
        <h1 className="text-center">Welcome {user}</h1>
        <form className="row justify-content-center" onSubmit={this.addItem}>
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
                  value={this.state.item}
                  onChange={this.handleChange}
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
            handleChecked={this.handleChecked}
            deleteItem={this.deleteItem}
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
            handleChecked={this.handleChecked}
            deleteItem={this.deleteItem}
          />
        ))}
      </div>
    );
  }
}

export default Home;
