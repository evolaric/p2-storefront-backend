CREATE TABLE IF NOT EXISTS categories (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_name VARCHAR(100) UNIQUE NOT NULL CONSTRAINT min_length_product_name check (length(product_name) >= 3),
    price NUMERIC(12, 2) NOT NULL,
    info TEXT,
    category INT DEFAULT 1 NOT NULL,
    FOREIGN KEY (category) REFERENCES categories(id)
);