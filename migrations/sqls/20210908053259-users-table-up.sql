CREATE TABLE IF NOT EXISTS users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_name VARCHAR(100) UNIQUE NOT NULL CONSTRAINT min_length_user_name check (length(user_name) >= 6),
    first_name VARCHAR(100) NOT NULL CONSTRAINT min_length_first_name check (length(first_name) >= 1),
    last_name VARCHAR(100) NOT NULL CONSTRAINT min_length_last_name check (length(last_name) >= 1),
    admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    password_digest TEXT NOT NULL
);