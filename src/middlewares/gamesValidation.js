import { db } from "../database/database.connection.js";
import GameSchema from "../schemas/games.schema.js";

export async function gameValidation(req, res, next){
    const { name } = req.body;

    const validation = GameSchema.validate(req.body, { abortEarly: false});
    if(validation.error){
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(400).send(errors);
    };

    try{
        const verifyName = await db.query(`SELECT * FROM games WHERE name=$1;`, [name]);
        if(verifyName.rows.length !== 0) return res.status(409).send("Nome já existe");

    } catch (err){
        return res.status(500).send(err.message);
    }
    next();
};