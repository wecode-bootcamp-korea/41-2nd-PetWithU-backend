-- migrate:up
CREATE TABLE community_post_details (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  category_id INT NOT NULL,
  content VARCHAR(1000) NULL,
  image_url VARCHAR(255) NOT NULL,
  point_x INT NULL,
  point_y INT NULL,
  product_id INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES community_posts (id),
  FOREIGN KEY (category_id) REFERENCES community_categories (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);

-- migrate:down
DROP TABLE community_post_details;
