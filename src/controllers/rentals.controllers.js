import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getRentals (req, res){
    try{
        const rentals = await db.query(`
        SELECT rentals.*, customers.name AS "customerName", games.name AS "gameName" 
        FROM rentals
        JOIN customers ON customers.id = "customerId"
        JOIN games ON games.id = "gameId"
        ;`);
        const rentalsRows = rentals.rows;
        
        let rentalsObj = [];
        rentalsRows.forEach((rentals) => {
            const obj = {
                id: rentals.id,
                customerId: rentals.customerId,
                gameId: rentals.gameId,
                rentDate: rentals.rentDate,
                daysRented: rentals.daysRented,
                returnDate: rentals.returnDate,
                originalPrice: rentals.originalPrice,
                delayFee: rentals.delayFee,
                customer: {
                    id: rentals.customerId,
                    name: rentals.customerName
                },
                game: {
                    id: rentals.gameId,
                    name: rentals.gameName
                }
            };
            rentalsObj.push(obj);
        })

        return res.send(rentalsObj);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

export async function postRentals (req, res){
    const { customerId, gameId, daysRented } = req.body;
    const rentDate = dayjs().format('YYYY-MM-DD');
    
    try {
        const price = await db.query(`SELECT games."pricePerDay" FROM games WHERE id=$1;`, [gameId]);
        
        const rentals = await db.query(`SELECT * FROM rentals WHERE "gameId" = $1;`, [gameId])
        if (rentals.rowCount >= price.stockTotal) return res.sendStatus(400);
        const pricePerDay = price.rows[0].pricePerDay;

        const originalPrice = (daysRented * pricePerDay);

        await db.query(`
        INSERT INTO rentals 
        ("customerId", "gameId", "daysRented", "rentDate", "originalPrice")
        VALUES
        ($1, $2, $3, $4, $5)
        ;`,
        [customerId,  gameId, daysRented, rentDate, originalPrice]);
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

export async function postReturn (req, res){
    const { id } = req.params;
    const returnDate = dayjs().format('YYYY-MM-DD');

    try {
        const rentals = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
        if (rentals.rows[0].delayFee !== null) return res.sendStatus(400);
        const rentalsRows = rentals.rows[0];
        const priceDay = (rentalsRows.originalPrice / rentalsRows.daysRented);
        const notDelay = ((rentalsRows.daysRented - 1) * 86400000);
        
        let delayFee = Math.floor((((new Date(returnDate))  - new Date(rentalsRows.rentDate) - notDelay) / 86400000)) * priceDay;
        if(delayFee < 0) delayFee = 0;

        await db.query(`UPDATE rentals SET "delayFee" = $1, "returnDate" = $2 WHERE id=$3;`,[delayFee, returnDate, id]);


        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

export async function deleteRentals (req, res) {
    const { id } = req.params;

    try{
        const idExists = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
        if (!idExists.rows[0]) return res.sendStatus(404);   
        
        if(idExists.rows[0].returnDate === null) return res.sendStatus(400);

        await db.query(`DELETE FROM rentals WHERE id=$1;`, [id]);
        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};