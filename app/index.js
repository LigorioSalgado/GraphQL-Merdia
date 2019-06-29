require('dotenv').config();
const { GraphQLServer } =  require('graphql-yoga');
const { importSchema } = require('graphql-import');
const mongoose =  require('mongoose');
const resolvers =  require('./resolvers');
const typeDefs = importSchema('./app/schema.graphql'); 
const { AuthDirective } = require('./resolvers/directives');
const verifyToken =  require('./utils/verifyToken');

mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true })

const mongo =  mongoose.connection;

mongo.on('error', (error) => console.log(error))
	 .once('open', () => console.log("Connected to database"));

/* const resolvers = {
	Query:{
		prueba: () => "Hola desde graphql",
		saludo: (_,{texto}) => `Hola ${texto}`
	}
} */

const server =  new GraphQLServer({
	typeDefs,
	resolvers,
	schemaDirectives:{
		auth:AuthDirective
	},
	context: async({request}) => verifyToken(request) 

})

server.start(() => console.log("Server is working in port 4000"));



