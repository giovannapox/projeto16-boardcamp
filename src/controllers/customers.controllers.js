import { db } from "../database/database.connection.js";
import dayjs from "dayjs";

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers;`);
        const customersRows = customers.rows;
        console.log(customersRows)
        let customerObj = [];
        customersRows.forEach((customer) => {
            const obj = {
                id: customer.id,
                name: customer.name,
                phone: customer.phone,
                cpf: customer.cpf,
                birthday: dayjs(customer.birthday).format('YYYY-MM-DD')
            };
            customerObj.push(obj);
        })

        console.log(customerObj)
        return res.send(customerObj);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export async function getCustomersById(req, res) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.sendStatus(400);

    try {
        const customer = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);
        if (customer.rows.length === 0) return res.sendStatus(404);
        const customerRows = customer.rows[0];

        const customerById = {
            id: customerRows.id,
            name: customerRows.name,
            phone: customerRows.phone,
            cpf: customerRows.cpf,
            birthday: dayjs(customerRows.birthday).format('YYYY-MM-DD')
        };

        return res.send(customerById);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

export async function postCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;

    try {
        await db.query(`
        INSERT INTO customers 
        (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4);`,
            [name, phone, cpf, birthday]
        )
        return res.sendStatus(201);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};

export async function updateCustomers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    const { id } = req.params;

    try {
        await db.query(`
        UPDATE customers SET
        name=$1, phone=$2, cpf=$3, birthday=$4
        WHERE id=$5;`,
            [name, phone, cpf, birthday, id]
        )
        return res.sendStatus(200);
    } catch (err) {
        return res.status(500).send(err.message);
    };
};