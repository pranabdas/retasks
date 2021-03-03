import React from "react";

class FormError extends React.Component {
  render() {
    return <div className="alert alert-danger">{this.props.message}</div>;
  }
}

export default FormError;
