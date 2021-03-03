import React from "react";

class ToDoItem extends React.Component {
  render() {
    const checkedStyle = {
      color: "#cdcdcd",
      textDecoration: "line-through",
    };

    const { item, id, completed, handleChecked, deleteItem } = this.props;
    return (
      <div className="container todo-item col-sm-8">
        <li>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => handleChecked(e, id)}
          />
          <div style={completed ? checkedStyle : null}>{item}</div>

          <div
            className="btn btn-danger btn-sm del-btn"
            onClick={(e) => deleteItem(e, id)}
          >
            Delete task
          </div>
        </li>
      </div>
    );
  }
}

export default ToDoItem;
