const Item = require('../api/models/Item');

module.exports = {
    seedItem: async ({ property }) => {
        const item = new Item(
            {
                name: "fsfsdf",
                description: "sdfsdf",
                category: "dfdsfs",
                portions: [
                    {
                        name: "fsdfdsfs",
                        price: "130"
                    }
                ],
                ingredients: [
                    "sdfs", "dsfsd", "dsfsdf"
                ],
                property
            }
        );
        await item.save();
        return item;
    }
}