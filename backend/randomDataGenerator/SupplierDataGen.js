// SupplierDataGen.js
const { faker } = require("@faker-js/faker");
const { v4: uuidv4 } = require("uuid");
const SupplierSchema = require("../models/Supplier.schema");

const generateSupplierData = async () => {
	try {
		const suppliers = Array.from({ length: 10 }, () => {
			const companyName = faker.company.name();

			return {
				supplierId: uuidv4(),
				name: `${companyName} Pharmaceuticals`,
				contactPerson: faker.person.fullName(),
				email: faker.internet.email(),
				phone: faker.phone.number(),
				address: faker.location.streetAddress(true),
				status: faker.helpers.arrayElement(["Active", "Active", "Active", "Inactive"]), // 75% Active
				createdAt: faker.date.past(),
			};
		});

		await SupplierSchema.deleteMany({});
		const createdSuppliers = await SupplierSchema.insertMany(suppliers);
		console.log(
			"Supplier data generated successfully:",
			createdSuppliers.length,
			"records created"
		);
		return createdSuppliers;
	} catch (error) {
		console.error("Error generating supplier data:", error);
		throw error;
	}
};

module.exports = generateSupplierData;
