const Orders = require('./../models/order');

/**
 * Get all orders
 */
const list = (request, response, next) => {
    // Call back
    let callback = (error, orders) => {
        if (orders != null) {
            response.send(orders);
        } else {
            response.send([]);
        }
    }
    // Get orders array
    Orders.find({}, callback);
}

/**
 * create an order 
 */
const create = (request, response) => {
    let order = request.body.order;
    Orders.create(order, (error, order) => {
        if (error) {
            return response.status(403).send({
                message : 'Error when creating user',
                error : error
            });
        }
        return response.status(201).send(order);
    });
}
/**
 * update an order
 */
const update = (request, response) => {
    let order = request.body.order;
    Orders.update(
        { _id : order._id },
        order,
        (error, order) => {
            if (error)
                response.status(400).send({ error : error });
            else
                response.send({ order : order });
        },
    );
}

module.exports = {
    list,
    create,
    update,
};