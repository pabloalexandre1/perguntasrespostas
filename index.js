const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//database
connection.authenticate().then(() => {
    console.log("conexão feita com o banco de dados");
}).catch((msgErro) => {
    console.log(msgErro);
});

//ativando ejs e arquivos estáticos
app.set("view engine", "ejs");
app.use(express.static("public"));

//body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//routes
app.get("/", function(req, res){
    Pergunta.findAll({raw: true, order: [
        ["id", "DESC"]
    ]}).then(perguntas =>{
        console.log(perguntas);
        res.render("index", {
            perguntas: perguntas
        });
    });
    
});

app.get("/perguntar", function(req, res){
    res.render("perguntar");
});

app.get("/pergunta/:id",(req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where:{id: id}
    }).then(pergunta => {
        if(pergunta != undefined){//quando encontrar

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[ ["id", 'DESC'] ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

            
        }else{// quando nao encontrar
            res.redirect("/");
        }
    })
});

//rotas post

app.post("/salvarpergunta", function(req, res){
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/");
    });
});

app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });

});


//init the server

app.listen(4000, function(erro){
    if(erro){
        console.log("houve um erro");
    }else{
        console.log("rodando server");
    }
})