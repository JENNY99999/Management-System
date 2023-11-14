import axios from "axios";
import { base_url } from "../../utils/baseUrl";

const fetchOrders = async (configHeader) => {
  const response = await axios.get(`${base_url}user/allorders`, configHeader);
  return response.data;
};

const getOrder = async (data) => {
  const response = await axios.get(`${base_url}user/getsingleorder/${data.id}`, data.configHeader);
  return response.data;
};

const updateOrder = async (data) => {
  const response = await axios.put(`${base_url}user/order/update-order-status/${data.id}`, { status: data.status }, data.configHeader);
  return response.data;
};

const orderService = {
  fetchOrders,
  getOrder,
  updateOrder,
};


export default orderService;
