import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import { product } from "../services/api";
import type { Product } from "../types/products";

const ProductDetail = () => {
  const { id } = useParams();
  const [productsData, setProductsData] = useState<Product>({
    name: "",
    price: 0,
    description: "",
  });
  const loadProducts = useCallback(async () => {
    try {
      const data = await product.getProductById(id as unknown as number);
      setProductsData(data);
    } catch (err) {}
  }, []);
  useEffect(() => {
    loadProducts();
  }, []);
  if (!product) return <Typography>Product not found</Typography>;

  

  return (
    <Box p={4}>
      <img
        src={
          "https://images.unsplash.com/photo-1746366812501-53a73dc2e683?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt={productsData.name}
        width="300"
      />
      <Typography variant="h4">{productsData.name}</Typography>
      <Typography variant="h6">${productsData.price}</Typography>
      <Typography>{productsData.description}</Typography>
      <Button variant="contained" sx={{ mt: 2 }}>
        Add to Cart
      </Button>
    </Box>
  );
};

export default ProductDetail;
