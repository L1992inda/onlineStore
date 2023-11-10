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

  const [popupVisible, setPopupVisible] = useState(false);
  const [productBasket, setProductBasket] = useState([]);
  const [productDeliveryInfo, setProductDeliveryInfo] = useState([]);

  const addProduct = (newProduct) => {
    const exist = productBasket.some((p) => p.item === newProduct.Item);

    if (exist) {
      const updateBasket = productBasket.map((p) =>
        p.item === newProduct.Item ? { ...p, count: p.count + 1 } : p
      );

      setProductBasket(updateBasket);
    } else {
      const newProductToBasket = {
        item: newProduct.Item,
        productName: newProduct.Name,
        count: 1,
      };
      setProductBasket([...productBasket, newProductToBasket]);
    }
    setPopupVisible(true);
  };

  useEffect(() => {
    findSupplierForProducts();
  }, [productBasket]);

  const findSupplierForProducts = () => {
    const updateDeliveryInfo = [];

    productBasket.forEach((product) => {
      const matchingSuppliers = suppliers.filter((supplier) =>
        supplier.Items.some((item) => item.Item === product.item)
      );

      const deliveryTime = matchingSuppliers.map(
        (supplier) => supplier.Delivery
      );
      const fastestDelivery = deliveryTime.reduce((a, b) => (a < b ? a : b));

      const fastestSuppliers = matchingSuppliers.filter(
        (supplier) => supplier.Delivery === fastestDelivery
      );

      if (fastestSuppliers.length > 0) {
        let maxdeliverableItems = 0;
        let supplierWithMaxItems = null;

        fastestSuppliers.forEach((supplier) => {
          const supplierItems = supplier.Items.filter((item) =>
            productBasket.some((product) => item.Item === product.item)
          );

          if (supplierItems.length > maxdeliverableItems) {
            maxdeliverableItems = supplierItems.length;
            supplierWithMaxItems = supplier;
          }
        });

        if (supplierWithMaxItems) {
          const basketItem = productBasket.find(
            (basketItem) => basketItem.item === product.item
          );

          if (basketItem) {
            updateDeliveryInfo.push({
              product: basketItem.productName,
              count: basketItem.count,
              fastestDelivery: calculateDate(fastestDelivery),
              supplier: supplierWithMaxItems.Name,
            });
          }
        }
      }
    });
    setProductDeliveryInfo(updateDeliveryInfo);
  };

  const calculateDate = (deliveryTime) => {
    const number = parseInt(deliveryTime);
    const date = new Date();
    date.setDate(date.getDate() + number);

    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = date.toLocaleDateString("lv", options);
    return formattedDate;
  };

  const addedProductCount = () => {
    const productCount = productBasket.reduce((current, product) => {
      return current + product.count;
    }, 0);
    return productCount;
  };

  const findMatchingSuppliers = (productItem) => {
    const matchingSuppliers = suppliers.filter((supplier) =>
      supplier.Items.some((item) => item.Item === productItem)
    );
    return matchingSuppliers;
  };

  const fastestSupplier = (productItem) => {
    const matchingSuppliers = findMatchingSuppliers(productItem);

    if (matchingSuppliers.length === 0) {
      return null;
    } else {
      const deliveryTime = matchingSuppliers.map(
        (supplier) => supplier.Delivery
      );
      const fastestDelivery = deliveryTime.reduce((a, b) => (a < b ? a : b));

      const names = matchingSuppliers
        .filter((supplier) => supplier.Delivery === fastestDelivery)
        .map(
          (supplier) =>
            "Delivery time: " + fastestDelivery + "Supplier: " + supplier.Name
        );

      return names;
    }
  };

  const closePopupMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setPopupVisible(false);
  };

  function itemAddedMessage() {
    return (
      <Snackbar
        open={popupVisible}
        autoHideDuration={1500}
        onClose={closePopupMessage}
        message="prece ielikta grozā!"
      />
    );
  }

  const showProductAndCount = () => (
    <div>
      {productDeliveryInfo.map(
        ({ supplier, product, count, fastestDelivery, items }, index) => (
          <div key={index}>
            <h3>{`Supplier: ${supplier}`}</h3>
            <div>{`${product} - Count: ${count}, Delivery: ${fastestDelivery}`}</div>
          </div>
        )
      )}
    </div>
  );

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
                  {fastestSupplier(p.Item)}
                  <br />
                </Typography>
              </CardContent>
              <Divider variant="middle" />
              <CardActions sx={{ justifyContent: "center" }}>
                <Button
                  size="small"
                  onClick={() => {
                    addProduct(p);
                  }}
                >
                  add to basket
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
