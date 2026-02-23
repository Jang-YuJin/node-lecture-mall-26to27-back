const Order = require("../models/Order");
const { randomStringGenerator } = require("../utils/randomStringGenerator");
const lectureController = require("./lecture.controller");

const orderController = {};

orderController.createOrder = async(req, res) => {
    try {
        const {userId} = req;
        const {shipAddrss, contact, ttlPrc, orderList} = req.body;

        const insufficientStockItems = await lectureController.checkItemListStork(orderList);

        if(insufficientStockItems.length > 0){
            const errorMessage = insufficientStockItems.reduce((total, item) => (total += item.message), '');
            throw new Error(errorMessage);
        }

        const newOrder = new Order({
            userId,
            ttlPrc,
            shipAddrss,
            contact,
            items: orderList,
            orderNum: randomStringGenerator()
        });

        await newOrder.save();

        res.status(200).json({status: 'success', orderNum: newOrder.orderNum});
    } catch (error) {
        res.status(400).json({status: 'fail', message: error.message});
    }
};

module.exports = orderController;