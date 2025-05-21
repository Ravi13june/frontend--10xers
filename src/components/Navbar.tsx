import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Box,
  Tooltip,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, useNavigate } from "react-router-dom";
import { LogoutIcon } from "./Icons";
import { useAuth } from "../context/AuthContext";
// import { useCart } from '../context/CartContext';

const Navbar = () => {
  //   const { cart } = useCart();
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  //   const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const handleLogout = () => {
    logout()
    localStorage.clear(); // Or just remove specific keys like 'token', 'role'
    navigate("/login");
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
        >
          RK Mobile Store
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* <Button component={Link} to="/" color="inherit">Home</Button> */}
          {/* <Button component={Link} to="/products" color="inherit">Products</Button> */}
          {role === "user" && (
            <IconButton component={Link} to="/cart" color="inherit">
              <Badge badgeContent={2} color="secondary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          )}
          <Tooltip title="Logout">
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
