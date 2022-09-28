const { normalize, schema, denormalize } = require("normalizr");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const modulo = require("./service/message.serv.js");
const maneja = modulo.Maneja;
const mess = new maneja();

const mongoose = require("mongoose");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

let normalizedMess = "";
let objeto = "";
const authorSchema = new schema.Entity("author", {}, { idAttribute: "id" });
const textoSchema = new schema.Entity("text");


const mensajeSchema = new schema.Entity(
	"post",
	{
		author: authorSchema,
	},
	{ idAttribute: (value) => 123 }
);


app.post("/msg", (req, res) => {
	objeto = {
		author: {
			id: req.body.author.id,
			nombre: req.body.author.nombre,
			apellido: req.body.author.apellido,
			edad: req.body.author.edad,
			alias: req.body.author.alias,
			avatar: req.body.author.avatar,
		},
		text: req.body.text,
	};
	let mensagem = mess.guardar(objeto);
	normalizedMess = normalize(objeto, mensajeSchema);
	console.log("Normalizado :", JSON.stringify(normalizedMess).length);
	res.send(normalizedMess);
});

app.get("/msg", (req, res) => {
	let msg = denormalize(
		normalizedMess.result,
		mensajeSchema,
		normalizedMess.entities
	);
	console.log("Denormalizado: ", JSON.stringify(msg).length);
	res.send(msg);
});
app.listen(3000, () => {
	console.log(`Conexión al puerto 3000`);
});

connectMongo();
async function connectMongo() {
	try {
		const URL = "mongodb://localhost:27017/basededatos";
		let rta = await mongoose.connect(URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});

		console.log("Base de datos con mongoose");
	} catch (err) {
		console.log(err);
	}
}