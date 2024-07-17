exports.handler = async (event) => {
    console.log(`EVENT: ${JSON.stringify(event)}`);
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000", // Replace with your domain
            "Access-Control-Allow-Credentials": true, // Allow credentials
            "Access-Control-Allow-Headers": "Content-Type,Authorization",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify('Hello from Lambda!'),
    };
};
