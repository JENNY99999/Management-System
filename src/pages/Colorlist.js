import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { deleteAColor, getColors } from "../features/color/colorSlice";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";

const columns = [
    {
        title: "SNo",
        dataIndex: "key",
    },
    {
        title: "Name",
        dataIndex: "name",
        render: (text, record) => {
            const color = record.name;
            const rgb = hexToRgb(color);
            return <span>{rgb}</span>;
        },
    },
    {
        title: "Action",
        dataIndex: "action",
    },
];

function hexToRgb(hex) {
    if (!/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(hex)) {
        return null;
    }
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`;
}

const Colorlist = () => {
    const [open, setOpen] = useState(false);
    const [colorId, setcolorId] = useState("");
    const dispatch = useDispatch();

    const showModal = (e) => {
        setOpen(true);
        setcolorId(e);
    };

    const hideModal = () => {
        setOpen(false);
    };

    const deleteColor = async (e) => {
        try {
            await dispatch(deleteAColor(e));
            setOpen(false);
            dispatch(getColors());
        } catch (error) {
            console.error("Failed to delete color: ", error);
        }
    };

    useEffect(() => {
        dispatch(getColors());
    }, [dispatch]);

    const colorState = useSelector((state) => state.color.colors);
    const data1 = colorState.map((color, index) => ({
        key: index + 1,
        name: color.title,
        action: (
            <>
                <Link
                    to={`/admin/color/${color._id}`}
                    className=" fs-3 text-danger"
                >
                    <BiEdit />
                </Link>
                <button
                    className="ms-3 fs-3 text-danger bg-transparent border-0"
                    onClick={() => showModal(color._id)}
                >
                    <AiFillDelete />
                </button>
            </>
        ),
    }));

    return (
        <div>
            <h3 className="mb-4 title">Colors</h3>
            <div>
                <Table columns={columns} dataSource={data1} />
            </div>
            <CustomModal
                hideModal={hideModal}
                open={open}
                performAction={() => {
                    deleteColor(colorId);
                }}
                title="Are you sure you want to delete this color?"
            />
        </div>
    );
};

export default Colorlist;
