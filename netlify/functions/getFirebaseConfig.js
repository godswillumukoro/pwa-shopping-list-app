exports.handler = async (event, context) => {
    return {
      statusCode: 200,
      body: JSON.stringify({
        FIREBASE_REALTIME_DB: process.env.FIREBASE_REALTIME_DB
      })
    };
  };
