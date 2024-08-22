import React, { useState, useEffect } from 'react';
import { API_BASE_URL, ACCESS_TOKEN } from '../../constants';
import './products.css';
import Modal from 'react-modal';

// Configurar o root element para o Modal
Modal.setAppElement('#root');

const Products = () => {
  // Definindo estados para armazenar os valores dos campos do formulário e outros estados necessários
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // useEffect para buscar a lista de produtos quando o componente é montado
  useEffect(() => {
    fetchProducts();
  }, []);

  // Função para buscar produtos da API
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        throw new Error('Erro ao obter produtos');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar os campos
    if (!name || !price || !quantity) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (editingProduct) {
        // Atualizar um produto existente
        const response = await fetch(`${API_BASE_URL}/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name, price, quantity }),
        });

        if (response.ok) {
          setEditingProduct(null);
          setName('');
          setPrice('');
          setQuantity('');
          alert('Produto atualizado com sucesso!');
        } else {
          throw new Error('Erro ao atualizar produto');
        }
      } else {
        // Adicionar um novo produto
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ name, price, quantity }),
        });

        if (response.ok) {
          setName('');
          setPrice('');
          setQuantity('');
          alert('Produto adicionado com sucesso!');
        } else {
          throw new Error('Erro ao adicionar produto');
        }
      }

      // Atualizar a lista de produtos
      fetchProducts();
      setModalIsOpen(false); // Fechar o modal
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  // Função para deletar um produto
  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Atualizar a lista de produtos
        alert('Produto deletado com sucesso!');
        fetchProducts();
      } else {
        throw new Error('Erro ao deletar produto');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Função para preparar a edição de um produto
  const handleUpdate = (product) => {
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
    setEditingProduct(product);
    setModalIsOpen(true);
  };

  // Função para abrir o modal
  const openModal = () => {
    setName('');
    setPrice('');
    setQuantity('');
    setEditingProduct(null);
    setModalIsOpen(true);
  };

  // Função para fechar o modal
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="products-container">
      <h1>Gerenciar Produtos</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="products-content">
        <div className="products-list">
          <h2>Produtos em Estoque</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Quantidade</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <button
                      className="action-icon"
                      onClick={() => handleUpdate(product)}
                      aria-label={`Editar ${product.name}`}
                    >
                      <span role="img" aria-label="Editar">🖉</span>
                    </button>
                    <button
                      className="action-icon"
                      onClick={() => handleDelete(product.id)}
                      aria-label={`Deletar ${product.name}`}
                    >
                      <span role="img" aria-label="Deletar">🗑️</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className="add-product-button"
          onClick={openModal}
        >
          Adicionar Produto
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Product Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</h2>
        <form onSubmit={handleSubmit} className="products-form">
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
          <div className="modal-buttons">
            <button type="submit" className="submit-button">
              {editingProduct ? 'Atualizar Produto' : 'Adicionar Produto'}
            </button>
            <button type="button" className="cancel-button" onClick={closeModal}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;