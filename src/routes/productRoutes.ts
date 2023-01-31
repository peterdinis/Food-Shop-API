import express from 'express';
import { createProduct, displayAllProducts, productDetails } from '../controllers/productController';

const router = express.Router();

router.get('/products', displayAllProducts);
router.get("/product/:id", productDetails);
router.post("/products", createProduct);

export default router;