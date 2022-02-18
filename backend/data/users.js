import bcrypt from 'bcryptjs';

const users = [
	{
		name: 'Admin User',
		email: 'admin@example.com',
		password: bcrypt.hashSync('123456', 10),
		isAdmin: true,
	},
	{
		name: 'Goje',
		email: 'goje@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		name: 'Boalfa',
		email: 'boalfa@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
];

export default users;
