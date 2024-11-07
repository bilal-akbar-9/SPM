const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");
const UserSchema = require("../models/User.schema");
const PharmacySchema = require("../models/Pharmacy.schema");

// Helper function for generating short unique IDs
const generateShortId = () => {
    const fullUuid = uuidv4().replace(/-/g, "");
    const length = Math.floor(Math.random() * 3) + 6; // Random length between 6-8
    return fullUuid.substring(0, length).toUpperCase();
};

const generateUserData = async () => {
    try {
        const pharmacies = await PharmacySchema.find().select('pharmacyId');
        const pharmacyIds = pharmacies.map(p => p.pharmacyId);

        const users = Array.from({ length: 20 }, () => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            
            return {
                userId: generateShortId(), // Added short unique ID
                username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
                password: faker.internet.password({ length: 10 }),
                name: `${firstName} ${lastName}`,
                role: faker.helpers.arrayElement(['user', 'user', 'user', 'admin']),
                pharmacyId: faker.helpers.arrayElement(pharmacyIds)
            };
        });

        await UserSchema.deleteMany({});
        const createdUsers = await UserSchema.insertMany(users);
        console.log('User data generated successfully:', createdUsers.length, 'records created');
        return createdUsers;
    } catch (error) {
        console.error('Error generating user data:', error);
        throw error;
    }
};

module.exports = generateUserData;