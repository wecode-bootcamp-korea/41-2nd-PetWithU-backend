-- migrate:up
CREATE TABLE promenade_cities (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- migrate:down
DROP TABLE promenade_cities;