import "../css/commonHeader.css";
import logo from "../img/scLogo.png";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import { useCallback, useContext, useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeFirebase } from "../database/firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { CartContext } from "../context/CartContext";

const CommonHeader = ({ Children , img , name }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLogin, setLogin } = useContext(LoginContext);
  const { itemsCount, setItemsCount } = useContext(CartContext);
  const app = initializeFirebase();

  const handleLogin = () => {
    if (!isLogin) {
      navigate("/loginScreen");
    } else {
      const auth = getAuth(app);
      signOut(auth)
        .then(() => {
          localStorage.setItem("islogin", "false");
          setLogin(false);
          navigate("/");
          navigate(0);
        })
        .catch((error) => {
          // An error happened.
        });
    }
  };

  useEffect(() => {
    let isLogin = localStorage.getItem("islogin");
    if (isLogin === "true") {
      setLogin(true);
    }
  }, []);

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: -3,
      top: -3,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow mb-5">
      <div className="container mycustombtn">
        <img src={logo} className="img-logo" />
        <a className="navbar-brand" href={isLogin ? "/dashboard" : "/"}>
          Signature cuisine
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse "
          id="navbarResponsive"
          style={{ alignContent: "center" }}
        >
          <ul className="navbar-nav ms-auto">
            {isLogin && (
              <li className="nav-item active align-content-sm-center">
                <a className="nav-link" href="/dashboard">
                  Home
                </a>
              </li>
            )}
            <li className="nav-item align-content-sm-center">
              <a className="nav-link" href="#">
                About
              </a>
            </li>
            
           {isLogin&& <li className="nav-item align-content-sm-center">
              <a
                className="nav-link"
                href="/Orders"
                onClick={(e) => {
                  e.preventDefault();
                  setItemsCount(itemsCount);
                  navigate("/Orders");
                }}
              >
                Orders
              </a>
            </li>}
            <li className="nav-item align-content-sm-center">
              <IconButton aria-label="cart" onClick={(e)=> navigate('/cartscreen')}>
                <StyledBadge badgeContent={itemsCount} color="secondary">
                  <ShoppingCartIcon />
                </StyledBadge>
              </IconButton>
            </li>

            <li className="nav-item align-content-sm-center  ps-3">
            <IconButton onClick={handleClick} sx={{ p: 0 }} data-bs-toggle="tooltip" data-bs-placement="bottom" title={name?name:"Signature cuisine"}>
                <Avatar
                sx={{border:'solid'}}
                  alt= {name?name:"Signature cuisine"}
                  src= {img ? img :"/static/images/avatar/2.jpg"}
                  variant="rounded"
                />
              </IconButton>

              <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
              >
                <List
                  sx={{
                    width: "100%",
                    maxWidth: 250,
                    bgcolor: "background.paper",
                  }}
                  aria-label="contacts"
                >
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleLogin}>
                      <ListItemIcon>
                        <ExitToAppIcon />
                      </ListItemIcon>
                      <ListItemText secondary={isLogin ? "Logout" : "Login"} />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Popover>
            </li>
          </ul>
        </div>
      </div>

      {Children}
    </nav>
  );
};

export default CommonHeader;
