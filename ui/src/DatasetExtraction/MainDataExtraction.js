import React, { Component } from 'react';
import './MainDataExtraction.css';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python';
import { isEqual } from 'lodash';
import $ from 'jquery';

class MainDataExtraction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      config: {
        source: ''
      }
    };
  }

  componentDidMount() {
  	fetch('/ensemble/extraction/main-dataset/?path=' + this.props.path)
	  .then(response => response.json())
	  .then(json => {
	  	console.log(json);
	    this.setState({config: json});
      this.savedConfig = json;
	  });
  }

  saveSetup() {
    var payload = this.state.config;

    fetch(
      '/ensemble/extraction/main-dataset/?path=' + this.props.path,
      {
      	method: "PATCH",
      	body: JSON.stringify( payload ),
      	headers: new Headers({
      	  'Content-Type': 'application/json'
      	})
      }
    )
    .then(response => response.json())
    .then(json => {
	  	console.log(json);
	  	this.savedConfig = json;
	    this.setState({
	      config: json
	    });
      this.props.setSame(true);
      this.props.addNotification({
        title: 'Success',
        message: 'Saved main dataset extraction method',
        level: 'success'
      });
	  });
  }

  newSource(newCode) {
  	console.log('change newCode to ' + newCode);
  	console.log(newCode === this.oldCode);
  	this.setState((prevState) => {
      var config = $.extend({}, prevState.config); // Make copy
      config.source = newCode;
      this.props.setSame(isEqual(config, this.savedConfig));
      return {
        config
      };
    })
  }

  render() {
    var options = {
      lineNumbers: true,
      indentUnit: 4
    };
  	return (
      <div className='MainDataExtraction'>
    	  <h3> Main Dataset Extraction Source Code</h3>
    	  <CodeMirror value={this.state.config.source} 
        onChange={(src) => this.newSource(src)} options={options}/>
    	  <button 
        disabled={this.props.same} 
        onClick={() => this.saveSetup()}>
          Save Main Dataset Extraction Setup
        </button>
    	</div>
    );
  }
}

export default MainDataExtraction;
