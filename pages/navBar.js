import * as React from "react";
import { useState } from "react";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import Modal from "@mui/material/Modal";
import CloseSharpIcon from "@mui/icons-material/CloseSharp";

export default function NavBar({ addedProductCount, showProductAndCount }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const StyledBadge = styled(Badge)(() => ({
    "& .MuiBadge-badge": {
      border: "1px solid",
      padding: "5px",
    },
  }));

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <IconButton onClick={handleOpen}>
            <StyledBadge badgeContent={addedProductCount} color="error">
              <ShoppingBasketIcon sx={{ color: "white" }} />
            </StyledBadge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            height: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <CloseSharpIcon
            color="action"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              "&:hover": { color: "#2a2d29" },
            }}
            onClick={handleClose}
          />
          <Typography id="modal-modal-title" variant="body2" component="div">
            Iepirkuma grozs:
          </Typography>
          <Typography
            id="modal-modal-description"
            variant="body2"
            component="div"
            sx={{ mt: 2 }}
          >
            {showProductAndCount}
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}
