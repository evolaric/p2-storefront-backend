CREATE TABLE IF NOT EXISTS orders (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    status BOOLEAN NOT NULL DEFAULT false,
    created_at BIGINT,
    closed_at BIGINT
);

CREATE TABLE IF NOT EXISTS order_details (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    product_id INT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id),
    quantity INT NOT NULL
);