import { Component, createRef } from "preact";

import TagSelect from './TagSelect';

export default class extends Component {
    constructor(props) {
      super(props);
      this.props = props;
      this.select = createRef();
    }

    getValue() {
      return this.select.current.state.value;
    }

    render() {
      return <TagSelect ref={this.select} />
    }
}