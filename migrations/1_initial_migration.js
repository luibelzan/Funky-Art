const Migrations = artifacts.require("Migrations");
//const TodoList = artifacts.require("TodoList");
const MyNFT = artifacts.require("MyNFT");

module.exports = function (deployer) {
    deployer.deploy(Migrations);
    //deployer.deploy(TodoList);
    deployer.deploy(MyNFT);
};