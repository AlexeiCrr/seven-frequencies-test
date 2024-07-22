const mysql = require("promise-mysql");

exports.handler = async (event, context) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const dbConfig = {
    host: "taoc-prd.cegbt7mmflwn.us-west-1.rds.amazonaws.com",
    port: "3306",
    user: "super_adm",
    password: "taocfreq7_pass",
    database: "dbtaoc"
  };

	const corsHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Allow-Methods": "GET,OPTIONS"
	};

  try {
    const connection = await mysql.createConnection(dbConfig);
    // Extract licenseCode from query parameters
    const licenseCode = event.queryStringParameters?.licenseCode;

    console.log('Extracted licenseCode:', licenseCode);

    if (!licenseCode) {
      console.log('No licenseCode found in query parameters');
      return {
        statusCode: 400,
        body: JSON.stringify({message: "License code is required"})
      };
    }

		const query = "SELECT * FROM license_codes WHERE code = ? AND response_id IS NULL";
		const result = await connection.query(query, [licenseCode]);

		console.log('Query result:', result);

		await connection.end();

		if (result.length > 0) {
			return {
				statusCode: 200,
				headers: corsHeaders,
				body: JSON.stringify({isValid: true, message: "License code is valid and not associated with a response"})
			};
		} else {
			return {
				statusCode: 200,
				headers: corsHeaders,
				body: JSON.stringify({isValid: false, message: "License code is invalid or already associated with a response"})
			};
		}
  } catch (error) {
    console.error('Error:', error);
		return {
			statusCode: 400,
			headers: corsHeaders,
			body: JSON.stringify({message: "License code is required"})
		};
  }
};