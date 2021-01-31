const Admin = require('../api/models/Admin');
const Owner = require('../api/models/Owner');
const Operator = require('../api/models/Operator');
const Client = require('../api/models/Client');



module.exports = {
    seedAdmin: async () => {
        const admin = new Admin({ 
            first_name: "admin", 
            last_name: "admin", 
            role: "admin", 
            password: "password", 
            mobile: Date.now().toString() });
        await admin.save();
        return admin;
    },
    seedOwner: async () => {
        const owner = new Owner({ 
            first_name: "owner", 
            last_name: "owner", 
            role: "owner", 
            password: "password", 
            mobile: Date.now().toString() 
        });
        await owner.save();
        return owner;
    },
    seedOperator: async ({ work_on }) => {
        const operator = new Operator({ 
            first_name: "op", 
            last_name: "op", 
            role: "operator", 
            password: "password", 
            mobile: Date.now().toString(),
            work_on 
        });
        await operator.save();
        return operator;
    },
    seedClient: async () => {
        const client = new Client({ 
            first_name: "cli", 
            last_name: "cli", 
            role: "client", 
            password: "password", 
            mobile: Date.now().toString() 
        });
        await client.save();
        return client;
    }
}