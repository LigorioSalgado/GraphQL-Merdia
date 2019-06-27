const AuthorModel =  require('../models/Author');


const listAuthors =  async(root,params,context,info) => {

	const authors = await AuthorModel.find({});
	return authors
}


module.exports = {
	listAuthors
}