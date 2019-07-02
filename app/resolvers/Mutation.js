const AuthorModel =  require('../models/Author');
const PostModel = require('../models/Post');
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

const updateProfile = async(root,params,context,info) => {

	const {data} = params
	const {user} =  context
	let Author = await AuthorModel.findById(user._id)
	if(!Author) throw new Error(" Autor No Existe")
	Author = {...Author,...data}
	const updatedAuthor = await Author.save({new:true})
	return updatedAuthor.toObject();

}

const deleteProfile =  async(root,params,context,info) => {

	const {user} =  context;
	const author = await AuthorModel.findById(user._id);
	if(!author) throw new Error(" Autor No Existe")
	author.is_active = false;
	await author.save({new:true})

	return "Usuario eliminado"
}

const createPost = async(root,params,context,info) =>{

	const {user} = context;
	params.data.author = user._id
	const post = await PostModel.create(params.data)
								.catch( e => {throw new Error("Error al crear post")} )
	const newPost = PostModel.findById(post._id).populate('author');
	await AuthorModel.findOneAndUpdate({_id:user._id},{$push:{posts:post._id}})
						
	return newPost;
}

const updatePost = async(root,params,context,info) => {

	const {id,data} = params;
	const {user} = context;

	const updatedPost = await PostModel.findOneAndUpdate({_id:id,author:user._id},{$set:{...data}},{new:true})

	return updatedPost.toObject();

}

const deletePost = async(root,params,context,info) => {

	const {id} = params;
	const {user} = context;

	await PostModel.findOneAndUpdate({_id:id,author:user._id},{$set:{is_active:false}})

	return "Post eliminado"

}



module.exports = {
	createAuthor,
	login,
	updateProfile,
	deleteProfile,
	createPost,
	updatePost,
	deletePost
}