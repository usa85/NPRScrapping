// Dependency
var mongoose = require("mongoose");

// Creates Schema class
var Schema = mongoose.Schema;

// Create ArticlesSchema
var ArticlesSchema = new Schema({
    title: {
        type: String,
        required: true,
        index: { unique: true }
    },
    source: {
        type: String,
    },
    teaser: {
        type: String,
    },
    link: {
        type: String,
    },
    img: {
        type: String,
    },
    status: {
        type: Number,
        default: 0
    },
    comments: [{
        // Saves one comment's ObjectID
        type: Schema.Types.ObjectId,
        ref: "Comments"
    }]
});

// Creates Articles model
var Articles = mongoose.model("Articles", ArticlesSchema);

// Exports Articles model
module.exports = Articles;
