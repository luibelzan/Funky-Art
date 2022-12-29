const Migrations = artifacts.require("Migrations");
//const TodoList = artifacts.require("TodoList");
const MinterNFT = artifacts.require("MinterNFT");

module.exports = function (deployer) {
    deployer.deploy(Migrations);
    //deployer.deploy(TodoList);
    deployer.deploy(MinterNFT);
};