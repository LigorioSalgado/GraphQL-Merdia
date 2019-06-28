const AuthorModel =  require('../models/Author');
const authenticate =  require('../utils/authenticate');

const createAuthor =  async(root,params,context,info) => {

	const newAuthor =  await AuthorModel.create(params.data)
							.catch( e => {throw new Error("Ocurrio un problema") } )
	if(!newAuthor) throw new Error("No se creo el 'author'");
	return newAuthor.toObject();
}

const login =  async(root,params,context,info) => {
	const token =  await authenticate(params).catch( e => { throw e } )
	return {
		token,
		message:"Ok"
	}
}

module.exports = {
	createAuthor,
	login
}