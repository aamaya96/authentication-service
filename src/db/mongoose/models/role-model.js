const mongoose = require('mongoose');

const  roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        uppercase: true
    }
});

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;