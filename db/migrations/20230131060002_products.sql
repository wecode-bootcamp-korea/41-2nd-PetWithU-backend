-- migrate:up
CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  seller VARCHAR(255) NULL,
  price DECIMAL (10, 2) NULL,
  discount_price DECIMAL (10, 2) NULL,
  delivery_charge DECIMAL (10, 2) NULL,
  thumbnail VARCHAR(255),
  category_id INT NOT NULL,
  sales_volume INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES product_categories(id)
);

-- migrate:down
DROP TABLE products;
