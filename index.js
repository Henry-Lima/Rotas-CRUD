const Sequelize = require("sequelize");
const express = require("express");

const app = express(); 
const { create } = require("express-handlebars");


const conexaoComBanco = new Sequelize("gerenciamento", "root", "", {
    host: "localhost",
    dialect: "mysql",
});


const Projeto = conexaoComBanco.define("Projetos", {
    nome: {
        type: Sequelize.STRING,
    },

    descricao: {
        type: Sequelize.STRING,
    },

    data: {
        type: Sequelize.DATE,
    },

    funcionarios: {
        type: Sequelize.STRING,
    },
  });
  
  Projeto.sync({ force: false }); 

app.get("/salvar/:nome/:descricao/:data/:funcionarios", async function (req, res) {
    const {nome, descricao, data, funcionarios} = req.params; 

    const novoProjeto = await Projeto.create({ nome, descricao, data, funcionarios }); //função que espera
  
    try{
        res.json({
            resposta: "Projetos foi criado com sucesso !!!",
            Projeto: novoProjeto,
          }); // Retorna os registros em formato JSON
    }catch(error) {
        res.status(500).json({message: `Erro na criação do Projeto ${error}`})
    }
    
});

app.get("/mostrar", async function (req, res) {

    try {
        const mostrar = await Projeto.findAll(); // Busca todos os registros
        res.json(mostrar); // Retorna os registros em formato JSON
    }catch(error) {
        res.status(500).json({message:`Erro ao buscar alunos: ${error}`});
    }
    
});

app.get("/deletar/:id", async function (req, res) {

    const {id} = req.params;
    const idNumber = parseInt(id,10); // Converte o ID para número
 
    const deleted = await Projeto.destroy({
        where: { id: idNumber },
      });
    
      try {
        res.json({ mensagem: "Projeto deletado com sucesso" });
      } catch(error){
        res.status(404).json({ mensagem: "Projeto não encontrado" });
      }
});

app.get("/alterar/:id/:nome/:data", async function (req, res) {
    const { id, nome, data } = req.params;
    const idNumber = parseInt(id, 10); // Converte o ID para número
  
    try {
        const [updated] = await Projeto.update(
            { nome, data },
            {
            where: { id: idNumber }, // Usa o ID numérico
            }
        );
        res.json({
            mensagem: "Projeto atualizado com sucesso",
          });
    }catch(error) {
        res.status(500).json({ mensagem: `Erro na alteração do Projeto ${error}` });
    }

    
  });



//SEMPRE MANTENHA NO FINAL DO CÒDIGO 
app.listen(3031, function () {
  console.log("Server is running on port 3031");
});