import React from 'react';
import styles from "../style.css";
import {Bond} from 'oo7';
import {RRaisedButton, Rspan, TextBond, HashBond} from 'oo7-react';
import {formatBlockNumber, formatBalance, isNullData, makeContract} from 'oo7-parity';
import {TransactionProgressBadge} from 'parity-reactive-ui';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';




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
  }

  render() {

    return (
      <div>
        <HashBond bond={this.hash} floatingLabelText='Hash'/>

        <RRaisedButton label="Register as new testimonial" onClick={() => this.setState({
          tx: this.contract.create(this.hash)
        })}/>
          <Rspan> {this.contract.isValid(this.hash).map(v => v.toString())} </Rspan>
        <div style={{
          marginTop: '1em'
        }}>
          <TransactionProgressBadge value={this.state.tx}/>
        </div>
        <Rspan>
        <div>
          <List>
          <Subheader>Recent Events</Subheader>
          <Rspan>
            {this.tests.map(v => v.map(function(ele) {
              return (

                    <ListItem rightIconButton={<RaisedButton label="Update" onClick={() => this.setState({
                      tx: this.contract.update(ele.testimonyID, this.hash)
                    })}/>} primaryText={'From ' + ele.from}
                    secondaryText={'TID: ' + ele.testimonyID.toString() + ', Hash: ' + ele.hash}>
                    </ListItem>

              )
            }, this), this)}
          </Rspan>
          </List>
        </div>
        </Rspan>
      </div>
    );
  }
}
