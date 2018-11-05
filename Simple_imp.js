const SHA256 = require('crypto-js/sha256');

function CalculateHash(){
    return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.prevhash + this.nonce).toString();
}

class Transaction{
    constructor(fromaddr , toaddr , amt){
        this.fromaddr = fromaddr;
        this.toaddr = toaddr;
        this.amt = amt;
    }
}

class Block{
    constructor(timestamp , transaction, prevhash = '0'){
        this.timestamp = timestamp;
        this.transaction = transaction;
        this.prevhash = prevhash;
        this.nonce = 0;
        this.hash = CalculateHash();
    }

    nonceCalculator(difficulty){
        while(this.hash.substring(0 , difficulty) != Array(difficulty + 1).join(0)){
            this.nonce++;
            this.hash = CalculateHash();
        }
    }
}

class BlockChain{
    
    constructor(){
        this.blockchain = [];
        this.difficulty = 2;
        this.pendingList = [];
        //Insertion of Genesis Block
        this.blockchain.push(new Block('0/0/0' , 'Genesis' , 'Genesis' , '0' , '0000'));
    }

    pendingTransaction(timestamp , transaction){
        let block = new Block(timestamp , transaction , this.blockchain[this.blockchain.length - 1].hash);
        this.pendingList.push(block);
    }

    NewBlockAdder(timestamp , from , to , amt){
        let transaction = new Transaction(from , to , amt);
        this.pendingTransaction(timestamp , transaction);
    }

    MineBlock(index){
        if(index < 0 || index >= this.pendingList.length){
            console.log("Invalid Index !");
            return;
        }
        var blockToMine = this.pendingList[index];
        console.log("Block Mining ....")
        blockToMine.nonceCalculator(this.difficulty);
        blockToMine.prevhash = this.blockchain[this.blockchain.length - 1].hash;
        console.log("Block Mined Successfully !");
        //pushing the mined block into the chain...
        this.blockchain.push(blockToMine);

        //Removing the block from the pendingTransaction...
        delete this.pendingList[index];
        
    }

    CheckValid(){
        console.log(this.blockchain.length-1);
        for(var i = 1; i < this.blockchain.length-1; i++){
            console.log(i);
            var currentblock = this.blockchain[i];
            var nextblock = this.blockchain[i+1];
            console.log("0");
            
            //If Hash is still Valid...
            if(currentblock.hash != currentblock.CalculateHash())
                return false;

            //If prevhash is same as hash...
            if(nextblock.prevhash != currentblock.hash)
                return false;            
        }     
        //Only 1 block Exists...
        return true;   
    }
}

let bcobj = new BlockChain();
bcobj.NewBlockAdder('12/12/12' , 'Karthik' , 'Ankit' , '50');
bcobj.NewBlockAdder('3/5/13' , 'Ankit' , 'Rahul' , '70');
console.log(JSON.stringify(bcobj.pendingList , null , 4));
console.log(JSON.stringify(bcobj.blockchain , null , 4));

bcobj.MineBlock(1);

console.log(JSON.stringify(bcobj.pendingList , null , 4));
console.log(JSON.stringify(bcobj.blockchain , null , 4));

console.log(bcobj.CheckValid());

bcobj.blockchain[1].amt = 100;

console.log(bcobj.CheckValid());