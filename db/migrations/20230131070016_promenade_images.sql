-- migrate:up
CREATE TABLE promenade_images (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  promenade_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (promenade_id) REFERENCES promenade_posts (id)
);

-- migrate:down
DROP TABLE promenade_images;
