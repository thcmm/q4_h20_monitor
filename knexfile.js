// Update with your config settings.



module.exports = {

	development: {
		client: 'pg',
		connection: 'postgres://localhost/probe_data_dev'},
	test: {
		client: 'pg',
		connection: 'postgres://localhost/probe_data_test'},
	production:  {
		client: 'pg',
		connection: process.env.DATABASE_URL
	},
};












// module.exports = {
//
//   development: {
//     client: "pg",
//     connection: "postgres://localhost/messages_dev"
//   },
//   test: {
//     client: "pg",
//     connection: "postgres://localhost/messages_test"
//   },
//   production: { },
//
// };
