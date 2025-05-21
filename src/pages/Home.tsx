import React, { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  CardMedia,
  Box,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { product } from "../services/api";
const pageSize = 5;
const Home: React.FC = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [productsData, setProductsData] = useState<{
    products: any[];
    total: number;
  }>({ products: [], total: 0 });
  const [isLoading, setIsLoading] = useState(false);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await product.getAll(page, pageSize);
      setProductsData(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const totalPages = Math.ceil((productsData?.total || 0) / pageSize);
  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  return (
    <Box>
      <Grid container spacing={3} padding={2}>
        {productsData &&
          productsData.products &&
          productsData.products.map((product: any) => (
            <Grid key={product.id}>
              <Grid container spacing={4}>
                <Card
                  sx={{ maxWidth: 445, width: 400, minHeight: 445 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    height="240"
                    image="https://images.unsplash.com/photo-1746366812501-53a73dc2e683?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.name}
                    </Typography>
                    <Typography>${product.price.toFixed(2)}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {product.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Add to Cart</Button>
                    <Button size="small">Buy Now</Button>
                  </CardActions>
                </Card>
              </Grid>
            </Grid>
          ))}
      </Grid>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <Box mt={4} display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default Home;
