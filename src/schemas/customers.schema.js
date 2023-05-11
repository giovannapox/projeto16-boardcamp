import joi from "joi";

const CustomersSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().min(10).max(11).required(),
    cpf: joi.string().min(11).max(11).pattern(new RegExp('^[0-9]+$')).required(),
    birthday: joi.string().required().date()
});

export default CustomersSchema;