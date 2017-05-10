import React from 'react';
import styles from "../style.css";
import {Bond} from 'oo7';
import {RRaisedButton, Rspan, TextBond, HashBond} from 'oo7-react';
import {formatBlockNumber, formatBalance, isNullData, makeContract} from 'oo7-parity';
import {TransactionProgressBadge, AccountIcon} from 'parity-reactive-ui';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Subheader from 'material-ui/Subheader';
import Chip from 'material-ui/Chip';
//import {blue300, indigo900} from 'material-ui/styles/colors';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import {Tabs, Tab} from 'material-ui/Tabs';

import {sha3_256} from 'js-sha3';


const TestimonyABI = [
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "lookup",
    "outputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "payable": false,
    "type": "function"
  }, {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "isValid",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  }, {
    "constant": false,
    "inputs": [
      {
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "create",
    "outputs": [],
    "payable": false,
    "type": "function"
  }, {
    "constant": false,
    "inputs": [
      {
        "name": "testimonyID",
        "type": "uint256"
      }, {
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "update",
    "outputs": [],
    "payable": false,
    "type": "function"
  }, {
    "inputs": [],
    "payable": false,
    "type": "constructor"
  }, {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "from",
        "type": "address"
      }, {
        "indexed": false,
        "name": "testimonyID",
        "type": "uint256"
      }, {
        "indexed": false,
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "savedTestimony",
    "type": "event"
  }
];

export class App extends React.Component {
  constructor() {
    super();
    this.contract = parity.bonds.makeContract('0x0AD24CEab0555599429ec755c8492Ae9B2c2Fe94', TestimonyABI);
    this.tests = this.contract.savedTestimony();
    this.owner = new Bond;
    this.id = new Bond;
    this.hash = new Bond;
    this.valid = false;
    this.state = {
      tx: null
    };
    this.file = false;
  }



  render() {

    return (
      <div>
      <Tabs>
        <Tab label="Register/Update" >
        <Card>
          <CardHeader title="Enter your Testimony Hash" subtitle={<TransactionProgressBadge value={this.state.tx}/>} actAsExpander={false} showExpandableButton={false}/>
          <CardActions>
            <div id="drop_zone" onDragOver={this.handleDragOver.bind(this)} onDrop={this.handleFileSelect.bind(this)}>
              {this.file
                ? <span>{this.file.name}, {this.file.type}
                    - {this.file.size}
                    Bytes</span>
                : "Drop file here"
}
            </div>
            <RaisedButton primary={true} label="Register new Testimony" onClick={() => this.setState({
              tx: this.contract.create(this.file.hash)
            })} fullWidth={true}/>
          </CardActions>
        </Card>
        <Rspan>
          {this.contract.isValid(this.hash).map(v => v.toString())}
        </Rspan>
        <div style={{
          marginTop: '1em'
        }}>
        </div>
        <Rspan>
          <div>
            <List>
              <Subheader>Recent Events</Subheader>
              <Rspan>
                {this.tests.map(v => v.map(function(ele) {
                  return (

                    <ListItem leftAvatar={
                      <AccountIcon
            	         style={{width: '1.2em', verticalAlign: 'bottom', marginLeft: '1ex'}}
            	         key={ele.from}
            	         address={ele.from}
                         />
                       } rightIconButton={< RaisedButton label = "Update" onClick = {
                      () => this.setState({
                        tx: this.contract.update(ele.testimonyID, this.hash)
                      })
                    } />} primaryText={'From ' + ele.from} secondaryText={'TID: ' + ele.testimonyID.toString() + ', Hash: ' + ele.hash}></ListItem>

                  )
                }, this), this)}
              </Rspan>
            </List>
          </div>
        </Rspan>
        </Tab>
        <Tab label="Validate" >
        <Card>
          <CardHeader title="Enter your Testimony" actAsExpander={false} showExpandableButton={false}/>
          <CardActions>
            <div id="drop_zone" onDragOver={this.handleDragOver.bind(this)} onDrop={this.handleFileSelect.bind(this)}>
              {this.file
                ? <span>{this.file.name}, {this.file.type}
                    - {this.file.size}
                    Bytes</span>
                : "Drop file here"
}
            </div>
            <RaisedButton primary={true} label="Validate" onClick={() => this.setState({
              tx: this.contract.create(this.file.hash)
            })} fullWidth={true}/>
          </CardActions>
        </Card>
        
        </Tab>
        </Tabs>

      </div>
    );
  }

  handleFileSelect(evt) {
    var that = this;
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output;
    for (var i = 0, f; f = files[i]; i++) {
      output = {
        name: f.name,
        type: f.type || "n/a",
        size: f.size
      };
      this.file = output;

      var reader = new FileReader();

      reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
          var hash = sha3_256(evt.target.result);
          that.file.hash = "0x" + hash;
          console.log(that.file.name + " hash: " + that.file.hash);

          // TODO: Substitute the following workaround with something react-like
          // document.getElementById('hash_field').value = "0x" + that.file.hash.toString();
          // that.hash = new Bond("0x" + that.file.hash);
          document.getElementById('drop_zone').innerHTML = "<span style={color:#FFF;font-size:100%}>" + that.file.name + ", " + that.file.type + " - " + that.file.size + " Bytes: " + that.file.hash + "</span>";
        }
      };

      reader.readAsBinaryString(f);

      break;
    }
    console.log(output);
  }

  handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }
}
