import React, { useEffect, useState } from "react";
import { product } from "../../services/api";
import {
  Button,
  Typography,
  Box,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardContent,
  CardActions,
  CardMedia,
  Card,
} from "@mui/material";

interface ProductForm {
  id?: number;
  name: string;
  description: string;
  price: number;
}

const AdminDashboard: React.FC = () => {
  const role = localStorage.getItem("role");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [productsData, setProductsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    description: "",
    price: 0,
  });
  console.log("formData", formData);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await product.getAdminProducts();
      setProductsData(data);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      loadProducts();
    }
  }, [role]);

  if (role !== "admin") return <Typography>Unauthorized</Typography>;
  if (error) return <Typography>{error}</Typography>;

  const handleOpen = (product?: ProductForm) => {
    if (product) setFormData(product);
    else setFormData({ name: "", description: "", price: 0 });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    if (formData.id) {
      const id = formData.id;
      const newProduct = await product.update(id, formData);
      if (newProduct) {
        loadProducts();
      }
    } else {
      const newProduct = await product.create(formData);
      setProductsData((prev) => [...prev, newProduct]);
    }
    setOpen(false);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedProductId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedProductId !== null) {
      try {
        await product.delete(selectedProductId);
        setProductsData((prev) =>
          prev.filter((p) => p.id !== selectedProductId)
        );
        setDeleteDialogOpen(false);
      } catch (err) {
        setError("Delete failed. Please try again.");
      }
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setSelectedProductId(null);
  };

  return (
    <Box p={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" mb={3}>
          Admin Dashboard
        </Typography>
        <Button variant="contained" onClick={() => handleOpen()} sx={{ mb: 2 }}>
          Add New Product
        </Button>
      </Box>
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Grid container spacing={4}>
          {productsData?.map((product) => (
            <Grid key={product.id}>
              <Card sx={{ maxWidth: 445, width: 400, minHeight: 445 }}>
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
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {product.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => handleOpen(product)}>Edit</Button>
                  <Button onClick={() => handleDeleteClick(product.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {formData.id ? "Edit Product" : "Add New Product"}
        </DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Product Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: Number(e.target.value) })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>
            {formData.id ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
