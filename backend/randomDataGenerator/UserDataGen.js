const { faker } = require("@faker-js/faker");
const UserSchema = require("../models/User.schema");
const PharmacySchema = require("../models/Pharmacy.schema");
const mongoose = require("mongoose");

const generateUserData = async () => {
    try {
        // Get existing pharmacy IDs
        const pharmacies = await PharmacySchema.find().select('pharmacyId');
        const pharmacyIds = pharmacies.map(p => p.pharmacyId);

        const users = Array.from({ length: 15 }, () => {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            
            return {
                username: faker.internet.userName({ firstName, lastName }).toLowerCase(),
                password: faker.internet.password({ length: 10 }),
                name: `${firstName} ${lastName}`,
                role: faker.helpers.arrayElement(['user', 'user', 'user', 'admin']), // 25% chance of admin
                pharmacyId: faker.helpers.arrayElement(pharmacyIds)
            };
        });

        // Clear existing data
        await UserSchema.deleteMany({});
        
        // Insert new data
        const createdUsers = await UserSchema.insertMany(users);
        console.log('User data generated successfully:', createdUsers.length, 'records created');
        return createdUsers;
    } catch (error) {
        console.error('Error generating user data:', error);
        throw error;
    }
};

module.exports = generateUserData;