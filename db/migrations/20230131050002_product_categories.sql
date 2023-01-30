-- migrate:up
CREATE TABLE product_categories (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- migrate:down
DROP TABLE product_categories;
