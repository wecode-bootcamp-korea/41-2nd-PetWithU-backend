-- migrate:up
CREATE TABLE product_options (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  product_id INT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- migrate:down
DROP TABLE product_options;
