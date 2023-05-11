import joi from "joi";

const GameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string().required(),
    stockTotal: joi.number().min(1).required(),
    pricePerDay: joi.number().min(1).required()
});

export default GameSchema;