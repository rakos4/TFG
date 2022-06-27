const md5 = require('md5');
class User {

    constructor(user,pass,encryption) {
        this.username=user || '';
        if(encryption) this.password=md5(pass) || '';
        else this.password=pass || '';
    }
    setUsername(user){
        this.username=user;
    }
    setPassword(pass){
        this.password=pass;
    }

    compareUser(user){
        var res = false;
        if(this.username===user.username && this.password === user.password) res = true;
        return res;
    }

    showInfo(){
        console.log("username: "+this.username+", password: "+this.password);
    }
}


module.exports = User;