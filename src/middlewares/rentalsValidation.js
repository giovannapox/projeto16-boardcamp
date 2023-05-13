import { db } from "../database/database.connection.js";
import RentalsSchema from "../schemas/rentals.schema.js";

export async function rentalValidation(req, res, next) {
    const { customerId, gameId } = req.body;
    const { id } = req.params;
    console.log(id)
    if(!id) {
        const validation = RentalsSchema.validate(req.body, { abortEarly: false });
    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(400).send(errors);
    };
    };

    try {
        if (!id) {
            const customerExists = await db.query(`SELECT * FROM customers WHERE id=$1;`, [customerId]);
            if (customerExists.rows.length === 0) return res.sendStatus(400);

            const gameExists = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
            if (gameExists.rows.length === 0) return res.sendStatus(400);
        } else {
            const idExists = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
            if (!idExists) return res.sendStatus(404);        
        }
    } catch (err) {
        return res.status(500).send(err.message);
    }
    next();
};