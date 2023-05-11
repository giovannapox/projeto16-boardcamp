import { db } from "../database/database.connection.js";
import CustomersSchema from "../schemas/customers.schema.js";

export async function customerValidation(req, res, next){
    const { cpf } = req.body;
    const { id } = req.params;

    const validation = CustomersSchema.validate(req.body, { abortEarly: false});
    if(validation.error){
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(400).send(errors);
    };

    try{
        if(!id) {
            const verifyCpf = await db.query(`SELECT * FROM customers WHERE cpf=$1;`, [cpf]);
            if(verifyCpf.rows.length !== 0) return res.status(409).send("CPF já cadastrado");
        } else {
            const verifyCpf = await db.query(`SELECT * FROM customers WHERE cpf=$1 AND id!=$2;`, [cpf, id]);
            if(verifyCpf.rows.length !== 0) return res.status(409).send("CPF já cadastrado");
        }

    } catch (err){
        return res.status(500).send(err.message);
    }
    next();
};