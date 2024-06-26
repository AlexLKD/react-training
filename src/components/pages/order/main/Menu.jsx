import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "../../../../theme";
import { formatPrice } from "../../../../utils/maths";
import Card from "../../../reusable-ui/Card";
import { useAdmin } from "../../../../context/AdminContext";
import Cart from "./Cart";
import axios from "../../../../lib/axios";

export default function Menu() {
  const { isAdminMode, restoreDefaultProducts, setSelectedProduct } = useAdmin();
  const [products, setProducts] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [cartItems, setCartItems] = useState({});

  const fetchCupcakes = async () => {
    try {
      const response = await axios.get('api/cupcakes');
        setProducts(response.data.data); 
      } catch (error) {
        console.error("Error fetching cupcakes:", error);
      }
    };
    
    useEffect(() => {
      fetchCupcakes();
      console.log(products);
  }, []);


  const handleCardSelect = (product) => {
    setSelectedProduct(product);
    setSelectedCardId(product.id);
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      if (prevItems[product.id]) {
        return { ...prevItems, [product.id]: { ...product, quantity: prevItems[product.id].quantity + 1 } };
      }
      return { ...prevItems, [product.id]: { ...product, quantity: 1 } };
    });
  };

  let adminActions;
  if (products.length === 0) {
    adminActions = isAdminMode ? (
      <div style={{ width: '70vw', display: 'flex', maxWidth: '1200px', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', padding: '0' }}>
        <p>Il n'y a plus de produits disponibles ?</p>
        <p>Cliquez ci-dessous pour les réinitialiser</p>
        <button className="btn-restore" onClick={restoreDefaultProducts}>Générer de nouveaux gâteaux</button>
      </div>
    ) : (
      <div style={{ width: '70vw', display: 'flex', maxWidth: '1200px', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', padding: '0' }}>
        <p>Victime de notre succès</p>
        <p>De nouvelles recettes sont en préparation, revenez vite !</p>
      </div>
    );
  }

  return (
    <MainContainer>
      <Cart cartItems={cartItems} setCartItems={setCartItems} />
      <MenuStyled className="menu">
        {products.length > 0 ? (
          products.map((item) => (
            <Card
              key={item.id}
              id={item.id}
              title={item.name}
              imageSource={item.image}
              price={formatPrice(item.price)}
              isSelected={item.id === selectedCardId}
              onSelect={handleCardSelect}
              onAddToCart={addToCart}
              className="card-container"
            />
          ))
        ) : (
          adminActions
        )}
      </MenuStyled>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
`;

const MenuStyled = styled.div`
  background: ${theme.colors.background_white};
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  padding: 50px 50px 150px;
  justify-items: center;
  box-shadow: inset 0px 4px 17px 0px rgba(0,0,0,0.73);
  width: 100%;

  .btn-restore {
    display: flex;
    height: 40px;
    align-items: center;
  }
`;
