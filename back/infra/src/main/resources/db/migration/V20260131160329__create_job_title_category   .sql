CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    embedding vector(1536),
    parent_id INTEGER REFERENCES category(id)
);

