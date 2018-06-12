import React, { Component } from 'react';

//todo: could be a stateless component
class IssueItem extends Component {

    constructor(props, context) {
        super(props, context);

        //this.state = {};
    }

  render() {
    return (
      <li style={{color: 'green'}}>
          {this.props.title}
      </li>
    );
  }
}

export default IssueItem;
