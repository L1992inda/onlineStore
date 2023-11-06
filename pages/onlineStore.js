import React from "react";
import { useState } from "react";
import NavBar from "./navBar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider";

export default function OnlineStore({ data }) {
  const products = data.Products;
  const suppliers = data.Suppliers;

  const [open, setOpen] = useState(false);
  const [productBasket, setProductBasket] = useState([
    {
      name: "",
      delivery: "",
      addedProducts: [],
    },
  ]);

  const addProduct = (newProduct) => {
    const matchcingSuppliers = findMatchingSuppliers(newProduct.Item);

    const delivery = matchcingSuppliers.map((supplier) => supplier.Delivery);
    const fastestDelivery = delivery.reduce((a, b) => (a < b ? a : b));
    const name = matchcingSuppliers.find(
      (supplier) => supplier.Delivery === fastestDelivery
    );

    const existingProduct = productBasket.find(
      (product) => product.name === name.Name
    );

    if (existingProduct) {
      const updatedProductBasket = productBasket.map((product) =>
        product.name === name.Name
          ? {
              ...product,
              addedProducts: [...product.addedProducts, newProduct.Name],
            }
          : product
      );
      setProductBasket(updatedProductBasket);
    } else {
      const addProduct = {
        name: name.Name,
        delivery: fastestDelivery,
        addedProducts: [newProduct.Name],
      };
      setProductBasket([...productBasket, addProduct]);
    }
  };

  const addedProductCount = () => {
    let total = 0;

    productBasket.map((p) => (total += p.addedProducts.length));

    return total;
  };

  const productBasketValue = productBasket;

  const findMatchingSuppliers = (productItem) => {
    const matchingSuppliers = suppliers.filter((supplier) =>
      supplier.Items.some((item) => item.Item === productItem)
    );
    return matchingSuppliers;
  };

  const fastestSupplier = (matchingSuppliers) => {
    if (matchingSuppliers.length === 0) {
      return null;
    } else {
      const deliveryTime = matchingSuppliers.map(
        (supplier) => supplier.Delivery
      );
      const fastesDelivery = deliveryTime.reduce((a, b) => (a < b ? a : b));
      const name = matchingSuppliers.find(
        (supplier) => supplier.Delivery === fastesDelivery
      );
      return "Delivery time: " + fastesDelivery + "\n Supplier: " + name.Name;
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  function itemAddedMessage() {
    return (
      <Snackbar
        open={open}
        autoHideDuration={1500}
        onClose={handleClose}
        message="prece ielikta grozā!"
      />
    );
  }

  const showProductAndCount = () => {
    const productCounts = productBasket.reduce((count, product) => {
      product.addedProducts.forEach((addedProduct) => {
        if (count[addedProduct]) {
          count[addedProduct]++;
        } else {
          count[addedProduct] = 1;
        }
      });
      return count;
    }, {});

    const productCountValue = Object.entries(productCounts).map(
      ([productName, count], index) => (
        <p key={index}>
          {productName}: {count}
        </p>
      )
    );

    return <div>{productCountValue}</div>;
  };

  return (
    <div>
      <NavBar
        addedProductCount={addedProductCount()}
        showProductAndCount={showProductAndCount()}
      />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          maxWidth: 500,
          gap: 30,
          margin: "auto",
        }}
      >
        {products.map((p) => {
          const noSupplierforProduct = findMatchingSuppliers(p.Item);
          if (noSupplierforProduct.length === 0) {
            return null;
          }
          return (
            <Card
              sx={{ width: 130, height: 200, boxShadow: 5, marginTop: 5 }}
              id={p.Item}
              key={p.Item}
            >
              <CardContent sx={{ paddingTop: 6 }}>
                <Typography
                  sx={{ paddingBottom: 4, fontSize: 18, textAlign: "center" }}
                >
                  {p.Name}
                </Typography>

                <Typography color="text.secondary" sx={{ fontSize: 10 }}>
                  {fastestSupplier(findMatchingSuppliers(p.Item))}
                  <br />
                </Typography>
              </CardContent>
              <Divider variant="middle" />
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  size="small"
                  onClick={() => {
                    handleClick(), addProduct(p);
                  }}
                >
                  basket
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </div>
      {itemAddedMessage()}
    </div>
  );
}
