import { Component, createRef } from "preact";
import Select from 'react-select';
import {useEffect, forwardRef, useImperativeHandle, useRef} from "react";

export default class extends Component {
    constructor(props) {
      super(props);
      this.props = props;
      this.selectRef = createRef();

      this.state = {
        options: [
          { value: 'chocolate', label: 'Chocolate123' },
          { value: 'strawberry', label: 'Strawberry' },
          { value: 'vanilla', label: 'Vanilla' }
        ]
      }

    }

    getValue() {
      return this.selectRef.current.state.value;
    }

    render() {
      return <Select ref={this.selectRef} isMulti={true} options={this.state.options} />
    }
}