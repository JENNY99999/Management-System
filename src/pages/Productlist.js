import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProducts, resetState } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";


const columns = [
    {
        title: "SNo",
        dataIndex: "key",

    },
    {
        title: "Title",
        dataIndex: "title",
        sorter: (a, b) => a.title.length - b.title.length,
    },
    {
        title: "Brand",
        dataIndex: "brand",
        sorter: (a, b) => a.brand.length - b.brand.length,
    },
    {
        title: "Category",
        dataIndex: "category",
        sorter: (a, b) => a.category.length - b.category.length,
    },
    {
        title: "Color",
        dataIndex: "color",
        render: (text) => (
            <div style={{ maxWidth: "480px" }}>{text}</div>
        ),

    },
    {
        title: "Price",
        dataIndex: "price",
        sorter: (a, b) => a.price - b.price,
        render: (text) => (
            <div>${parseFloat(text).toFixed(2)}</div>

        ),
    },
    {
        title: "Action",
        dataIndex: "action",

    },
];

const hexToRgb = (hex) => {
    const bigint = parseInt(hex, 16);
    const red = (bigint >> 16) & 255;
    const green = (bigint >> 8) & 255;
    const blue = bigint & 255;
    return `rgb(${red}, ${green}, ${blue})`;
};



const Productlist = () => {
    const [open, setOpen] = useState(false);
    const [productId, setProductId] = useState("");
    const showModal = (e) => {
        setOpen(true);
        setProductId(e);
    };

    const hideModal = () => {
        setOpen(false);
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(resetState());
        dispatch(getProducts());
    }, [dispatch]);
    const productState = useSelector((state) => state.product.products);
    const data1 = [];
    // let sno = 1;
    for (let i = 0; i < productState.length; i++) {
        const colors = productState[i].color.map((color) => {
            const hexColor = color.substring(0, 6);
            return hexToRgb(hexColor);
        });
        data1.push({
            key: productState.length - i,
            title: productState[i].title,
            brand: productState[i].brand,
            category: productState[i].category,
            color: colors.join(", "),
            price: `${productState[i].price}`,
            action: (
                <>
                    <Link
                        to={`/admin/product/${productState[i]._id}`}
                        className=" fs-3 text-danger"
                    >
                        <BiEdit />
                    </Link>
                    <button
                        className="ms-3 fs-3 text-danger bg-transparent border-0"
                        onClick={() => showModal(productState[i]._id)}>
                        <AiFillDelete />
                    </button>
                </>
            ),
        });
    }
    data1.reverse();



    const deleteProduct = async (e) => {
        try {
            await dispatch(deleteProducts(e));
            setOpen(false);
            dispatch(getProducts());
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };


    return (
        <div>
            <h3 className="mb-4 title">Products</h3>
            <div>
                <Table
                    columns={columns}
                    dataSource={data1}
                />
            </div>
            <CustomModal
                hideModal={hideModal}
                open={open}
                performAction={() => {
                    deleteProduct(productId);
                }}
                title="Are you sure you want to delete this Product?"
            />
        </div>
    );
};

export default Productlist;

















