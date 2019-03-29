var express=require('express');
var server=express();
var mysql=require('promise-mysql');
var path=require('path')
var db=require('./mysql/database');
const session=require('express-session');
//var validator = require('express-validator')
var bodyParser=require('body-parser');
const passport = require('passport');
const bcrypt = require('bcryptjs');
var asynclib= require('async');

//

// Constants
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

//

server.use(session({
  secret:'secret',
  resave:true,
  saveUninitialized:true
}));
//server.set configuration

server.set('view engine', 'ejs');
server.set('views', path.join(__dirname,'views'));

server.use(express.static(__dirname+'/public'))

server.use(bodyParser.urlencoded({extended: true}));
server.use(bodyParser.json());
//les differante route pour les page
    server.get('/',(req,res)=>{
        res.render('index')
        });
    
    server.get('/restauration',(req,res)=>{

    res.render('restauration')
    });
  server.get('/contact',(req,res)=>{
    
    res.render('contact')
  });
  server.get('/connexion',(req,res)=>{
        
        res.render('connexion')
    });
    server.get('/inscription',(req,res)=>{
        res.render('inscription')
      
    });
  //parametre pour inscription
    server.post('/inscription',(req, res) => {
      
        var email = req.body.email
        var nom = req.body.nom
        var prenom = req.body.prenom
        var motdepass = req.body.motdepass
        var motdepass2 = req.body.motdepass2
        if (!nom ||!prenom || !email || !motdepass || !motdepass2) {
          console.log( 'Renseigner toutes les champs');
          res.redirect('/inscription')
          }

        if (nom.length >= 13 || nom.length <= 4) {
            console.log( 'le nom  doit etre <= 13');
            res.redirect('/inscription')
          }
          if (motdepass != motdepass2) {
            //res.locals.error.motdepass = 'Mot de passe differant'
              console.log('Mot de passe differant');
              res.redirect('/inscription')
           }
    //errors.push({ msg: 'Mot de passe differant' });
          if (motdepass.length < 6) {
              console.log('Votre Mot de passe doit etre plus de 6 caracters');
          //errors.push({ msg: 'Votre Mot de passe doit etre plus de 6 caracters' });
            res.redirect('/inscription')
            }

          if (!EMAIL_REGEX.test(email)) {
              console.log ('email is not valid')
              res.redirect('/inscription')
          }

          if (!PASSWORD_REGEX.test(motdepass)) {
           console.log ('mort de pass est invalide elle doit etre plud e 8 caracteres doit contenir un chiffre et une lettre');
          res.redirect('/inscription')
        }
      
    db.query("INSERT INTO personnes (nom,prenom,email,motdepass) VALUES(?,?,?,?)",[nom,prenom,email,motdepass],(err,result) => {
      if(err) {
        console.log("LES DONNEES NE SONT PAS ENREGISTRER RENSEIGNER TOTES LES CHAMPS");
        }
      else {
         console.log("Vous etre inscrit avec succes vous pouvez vous connecter")
         res.redirect('/connexion')   
        }
        
      })
      
})
//
//ferification de la conction 
 server.post('/connexion',(req,res)=>{
    console.log(req.body)
    var email    = req.body.email;
    var motdepass = req.body.motdepass;
        if(email && motdepass){
          db.query('SELECT * FROM personnes WHERE email= ? AND motdepass = ?', [email, motdepass],(error,results,fields)=>{
              if (results.length > 0){
                    req.session.loggedin=true;
                    req.session.email=email;
                    res.redirect('/restauration');
              }else
                  {
                    res.send('Mot de Pass ou email Incorrect!')
                  }
              res.end();
            })
        } else{
              res.loc('Svp Entrer un email ou Mot de Pass');
              res.end();
            }
        }
 );
    


    
      
      

 
      
server.listen(3201,()=>{
    db.connect((err) =>{
            if(err)
                {console.log(err);
                }
            else{
                console.log('connected.');
                } 
        })
        console.log("Le server demarre sur le port 3201");
});
    