import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { GoogleIcon, FacebookIcon } from "../components/Icons";
import {
  Container,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";

type FormData = {
  email: string;
  password: string;
  role: "admin" | "user";
  name: string;
};

const Signup: React.FC = () => {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const onSubmit = async (data: FormData) => {
    const res = await signup(data);
    if (res) {
      navigate("/login");
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            mt: 8,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            gutterBottom
            fontWeight="bold"
          >
            Sign up
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mb: 4 }}
          >
            Buy or Sell Brand New Mobile best in the market
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%" }}
          >
            <TextField
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 6,
                  message: "Name must be at least 6 characters",
                },
              })}
              margin="normal"
              autoComplete="name"
              name="name"
              label="Full Name"
              fullWidth
              id="name"
              placeholder="Jon Snow"
            />
            <TextField
              margin="normal"
              label="Email Address"
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Please enter a valid email address",
                },
              })}
              autoComplete="email"
              variant="outlined"
            />
            <TextField
              margin="normal"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              variant="outlined"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>I am a</InputLabel>
              <Select
                {...register("role", {
                  required: "Name is required",
                })}
                labelId="role"
                name="role"
                label="Role"
              >
                <MenuItem value={"admin"}>Admin</MenuItem>
                <MenuItem value={"user"}>User</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="allowExtraEmails" color="primary" />}
              label="I want to receive updates via email."
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign up
            </Button>
          </Box>
          <Divider>
            <Typography sx={{ color: "text.secondary" }}>or</Typography>
          </Divider>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Google")}
              startIcon={<GoogleIcon />}
            >
              Sign up with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert("Sign up with Facebook")}
              startIcon={<FacebookIcon />}
            >
              Sign up with Facebook
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => navigate("/login")}
              sx={{ mt: 1 }}
            >
              Already have an account? Sign in
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default Signup;
