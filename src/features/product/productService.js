import axios from "axios";
import { config } from "../../utils/axiosconfig";
import { base_url } from "../../utils/baseUrl";

const getProducts = async () => {
  const response = await axios.get(`${base_url}product/`);
  return response.data;
};

const createProducts = async (product) => {
  const response = await axios.post(`${base_url}product/`, product, config);
  return response.data;
};

const updateProducts = async (product) => {
  const response = await axios.put(
    `${base_url}product/${product.id}`,
    {
      title: product.productData.title,
      brand: product.productData.brand,
      category: product.productData.category,
      color: product.productData.color,
      price: product.productData.price,
      description: product.productData.description,
      tag: product.productData.tag,
      quantity: product.productData.quantity,
      images: product.productData.images,

    },
    config
  );
  return response.data;
};

const deleteProducts = async (id) => {
  const response = await axios.delete(`${base_url}product/${id}`, config);
  return response.data;
};

const getProduct = async (id) => {
  const response = await axios.get(`${base_url}product/${id}`, config);
  return response.data;
};

const productService = {
  getProducts,
  createProducts,
  updateProducts,
  deleteProducts,
  getProduct,
};

export default productService;
