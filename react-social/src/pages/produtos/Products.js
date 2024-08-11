import React, { useState } from 'react';
import { API_BASE_URL, ACCESS_TOKEN } from '../../constants';
import './products.css';

const Products = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar os campos
    if (!name || !price || !quantity) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      // Obter o token do localStorage
      const token = localStorage.getItem(ACCESS_TOKEN);

      // Enviar a requisição para a API
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluir o token no cabeçalho
        },
        body: JSON.stringify({ name, price, quantity }),
      });

      if (response.ok) {
        // Limpar campos e mensagem de erro
        setName('');
        setPrice('');
        setQuantity('');
        setError('');
        alert('Produto adicionado com sucesso!');
      } else {
        throw new Error('Erro ao adicionar produto');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="products-container">
      <h1>Adicionar Produto</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Preço:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        <label>
          Quantidade:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <button type="submit">Adicionar Produto</button>
      </form>
    </div>
  );
};

export default Products;
