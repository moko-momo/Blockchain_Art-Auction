var ArtAuction = artifacts.require('./ArtAuction.sol');

module.exports = function(deployer) {
    deployer.deploy(ArtAuction);
}