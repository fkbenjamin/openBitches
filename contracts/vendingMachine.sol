pragma solidity ^0.4.11;

contract VendingMachine {
  enum Product {Coke, Fanta, Pepsi}

  mapping (uint => uint) private price;
  uint private balance;


  function inputMoney(uint money) {
    balance += money;
  }

  function select(uint product) {
    if (balance < price[product]) throw;

    balance -= price[product];
    return Product[product];
  }

}
