const config = require('../secret/config.js');
const models = require('../models');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
//validar el modulo de inicio de sesion
exports.signin = async(req, res, next) => {
    try {
        const user = await models.user.findOne({where: {email:req.body.email}});
        if(user){
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if(passwordIsValid){
                const token = jwt.sign({//firma del token
                    id: user.id,
                    name: user.name,
                    email: user.email
                },'config.secret',{
                    expiresIn: 86400, //se pone en segundos
                }
                );
                res.status(200).send({ auth: true, accessToken: token })
            }else{
                res.status(401).send({auth: false, accessToken: null, 
                reason: "Invalid Password!"
                
            })
        }
    }else{
        res.status(404).send('user Not Found.')  
        }
    }catch (error){
        res.status(500).send({
            message: 'Error->'
        })
        next(error);
    }
};

