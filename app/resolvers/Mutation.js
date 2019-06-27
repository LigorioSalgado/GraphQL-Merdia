const AuthorModel =  require('../models/Author');

const createAuthor =  async(root,params,context,info) => {

	const newAuthor =  await AuthorModel.create(params.data)
							.catch( e => {throw new Error("Ocurrio un problema") } )
	if(!newAuthor) throw new Error("No se creo el 'author'");
	return newAuthor.toObject();
}

module.exports = {
	createAuthor

}