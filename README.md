An application which uses FastAPI, SQLAchemy orm and Pydantic models to connect to PostgreSQL database and return data via an API request with static API key authentication. 
The application uses rate limiting, async, SQL table indexing and text_pattern_ops operator class for faster data transfer.


To test, generate an API key and save to environment variables as API_KEY, submit data as a form and api_key as a header. 