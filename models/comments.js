// Dependency
var mongoose = require("mongoose");

// Creates Schema class
var Schema = mongoose.Schema;

// Creates NotesSchema
var CommentsSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: true
	}
});

// Creates Comments model
var Comments = mongoose.model("Comments", CommentsSchema);

// Exports Comments model
module.exports = Comments;
