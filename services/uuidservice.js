const uuid = require('uuid/v4');

     function generateUUID() {
        return  uuid();
    }

    module.exports={
        generateUUID
    }
