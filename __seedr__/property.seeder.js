const Property = require('../api/models/Property');
const Owner = require('../api/models/Owner');

module.exports = {
    seedProperty : async ({owner}) => {
        const property = new Property(
            {
                owner,
                name: "p name",
                description: "desc",
                address: "loc",
                location: {
                    type: "Point",
                    coordinates: [
                        125,
                        30.7
                    ]
                }
            }
        );
        await property.save();
        await Owner.findByIdAndUpdate(owner,{ $push: { properties: property._id }});
        return property;
    }
}