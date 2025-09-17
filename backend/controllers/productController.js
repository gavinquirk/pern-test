import { sql } from '../config/db.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await sql`
    SELECT * FROM products
    ORDER BY created_at DESC
    `;
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch products' });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ error: 'Name, price, and image are required' });
  }
  try {
    const newProduct = await sql`
      INSERT INTO products (name, price, image)
      VALUES (${name}, ${price}, ${image})
      RETURNING *
    `;
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create product' });
  }
};

// Get a single product by ID
export const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: 'Product ID is required' });
  }
  try {
    const product = await sql`
      SELECT * FROM products WHERE id = ${id}
    `;
    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch product' });
  }
};
// Update a product by ID
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;
  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: 'Product ID is required' });
  }
  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, error: 'Name, price, and image are required' });
  }
  try {
    const updatedProduct = await sql`
      UPDATE products
      SET name = ${name}, price = ${price}, image = ${image}
      WHERE id = ${id}
      RETURNING *
    `;
    if (updatedProduct.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update product' });
  }
};

// Delete a product by ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, error: 'Product ID is required' });
  }
  try {
    const deletedProduct = await sql`
      DELETE FROM products WHERE id = ${id}
      RETURNING *
    `;
    if (deletedProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: 'Product not found' });
    }
    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete product' });
  }
};
