import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import NavBar from "./navBar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Divider from "@mui/material/Divider";
import style from "./style.module.css";

export default function OnlineStore({ data }) {
  const products = data.Products;
  const suppliers = data.Suppliers;

  const [open, setOpen] = useState(false);
  const [productMap, setProductMap] = useState(new Map());
  const [productBasket, setProductBasket] = useState([]);

  const addProduct = (newProduct) => {
    const productName = newProduct.Name;
    const updatedProductMap = new Map(productMap);

    if (updatedProductMap.has(productName)) {
      updatedProductMap.set(
        productName,
        updatedProductMap.get(productName) + 1
      );
    } else {
      updatedProductMap.set(productName, 1);
    }

    setProductMap(updatedProductMap);
  };

  useEffect(() => {
    findSupplierForProducts();
  }, [productMap]);

  const findSupplierForProducts = () => {
    const updateProductBasket = [];

    for (const [key] of productMap) {
      const foundProduct = products.find((product) => product.Name === key);
      if (foundProduct) {
        const matchingSuppliers = suppliers.filter((supplier) =>
          supplier.Items.some((item) => item.Item === foundProduct.Item)
        );

        const deliveryTime = matchingSuppliers.map(
          (supplier) => supplier.Delivery
        );
        const fastestDelivery = deliveryTime.reduce((a, b) => (a < b ? a : b));

        const name = matchingSuppliers.find(
          (supplier) => supplier.Delivery === fastestDelivery
        );

        if (name) {
          let existingSupplier = updateProductBasket.find(
            (data) => data.supplierName === name.Name
          );

          if (existingSupplier) {
            existingSupplier.productName.push(foundProduct.Name);
          } else {
            updateProductBasket.push({
              supplierName: name.Name,
              delivery: calculateDate(name.Delivery),
              productName: [foundProduct.Name],
            });
          }
        }
      }
    }

    setProductBasket(updateProductBasket);
  };

  const calculateDate = (deliveryTime) => {
    const number = parseInt(deliveryTime);
    const date = new Date();
    date.setDate(date.getDate() + number);

    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = date
      .toLocaleDateString(undefined, options)
      .replace(/\//g, ".");
    return formattedDate;
  };

  const addedProductCount = () => {
    const allValues = Array.from(productMap.values());
    let totalProducts = allValues.reduce(
      (total, current) => total + current,
      0
    );
    return totalProducts;
  };

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
      const fastestDelivery = deliveryTime.reduce((a, b) => (a < b ? a : b));
      const name = matchingSuppliers.find(
        (supplier) => supplier.Delivery === fastestDelivery
      );
      return "Delivery time: " + fastestDelivery + "Supplier: " + name.Name;
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
    return (
      <div>
        {productBasket.map((data, index) => (
          <div key={index}>
            {data.productName.map((product, i) => (
              <p key={i}>
                {product} - {productMap.get(product)} gab.
              </p>
            ))}
            <p>Delivery: {data.delivery}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <NavBar
        addedProductCount={addedProductCount()}
        showProductAndCount={showProductAndCount()}
      />
      <div className={style.div}>
        {products.map((p) => {
          const noSupplierforProduct = findMatchingSuppliers(p.Item);
          if (noSupplierforProduct.length === 0) {
            return null;
          }
          return (
            <Card className={style.card} id={p.Item} key={p.Item}>
              <CardContent className={style.content}>
                <Typography className={style.typography}>{p.Name}</Typography>

                <Typography color="text.secondary" className={style.fontSize}>
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
