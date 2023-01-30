-- migrate:up
CREATE TABLE community_categories (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR (255) NOT NULL
);

-- migrate:down
DROP TABLE community_categories;
