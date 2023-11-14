import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation } from "react-router-dom";
import { toast } from 'react-hot-toast';
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { createProducts, getAProduct, resetState, updateAProduct } from "../features/product/productSlice";




let schema = yup.object().shape({
    title: yup.string().required("Title is Required"),
    description: yup.string().required("Description is Required"),
    price: yup.number().required("Price is Required"),
    brand: yup.string().required("Brand is Required"),
    category: yup.string().required("Category is Required"),
    tags: yup.string().required("Tag is Required"),
    color: yup
        .array()
        .min(1, "Pick at least one color")
        .required("Color is Required"),
    quantity: yup.number().required("Quantity is Required"),
});

const Addproduct = () => {
    const dispatch = useDispatch();
    const [color, setColor] = useState([]);
    const location = useLocation();
    const getProductId = location.pathname.split("/")[3];
    useEffect(() => {
        dispatch(getBrands());
        dispatch(getCategories());
        dispatch(getColors());
    }, [dispatch]);

    const brandState = useSelector((state) => state.brand.brands);
    const cartState = useSelector((state) => state.pCategory.pCategories);
    const colorState = useSelector((state) => state.color.colors);
    const imgState = useSelector((state) => state.upload.images);
    const newProduct = useSelector((state) => state.product);
    const { isSuccess, isError, isLoading, createdProducts, productName, productBrand, productColor, productPrice, productDescription, productTag, productQuantity, productImages, productCategory, updatedProducts } = newProduct;

    const rgbColors = colorState.map((color) => {
        return {
            label: `rgb(${hexToRgb(color.title)})`,
            value: color._id,
        };
    });

    useEffect(() => {
        if (getProductId !== undefined) {
            dispatch(getAProduct(getProductId));
        }
    }, [getProductId, dispatch])

    useEffect(() => {
        if (isSuccess && createdProducts) {
            toast.success("Product Added Successfullly!");
        }
        if (updatedProducts && isSuccess) {
            toast.success('Product Updated Successfully!');

        }
        if (isError) {
            toast.error("Something Went Wrong!");
        }
    }, [isSuccess, isError, isLoading, createdProducts, updatedProducts]);


    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            title: productName || "",
            description: productDescription || "",
            price: productPrice || "",
            brand: productBrand || "",
            category: productCategory || "",
            tags: productTag || "",
            color: productColor || "",
            quantity: productQuantity || "",
            images: productImages || "",
        },
        validationSchema: schema,


        onSubmit: (values) => {
            if (getProductId !== undefined) {
                const data = { id: getProductId, productData: values };
                dispatch(updateAProduct(data));
                dispatch(resetState());
            } else {
                dispatch(createProducts(values));
                formik.resetForm();
                setColor(null);
                setTimeout(() => {
                    dispatch(resetState());
                }, 300);
            }
        },
    });


    const img = [];
    imgState.forEach((i) => {
        img.push({
            public_id: i.public_id,
            url: i.url,
        });
    });

    useEffect(() => {
        formik.values.color = color ? color : " ";
        formik.values.images = img;
    }, [color, img, formik.values]);


    const coloropt = [];
    colorState.map((color) => {
        const rgb = hexToRgb(color.title);
        const colorLabel = `rgb(${rgb})`;
        coloropt.push({
            label: colorLabel,
            value: color._id,
        });
        return null;
    });

    const handleColors = (e) => {
        setColor(e);
        console.log(color);
    };


    function hexToRgb(hex) {
        if (!/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(hex)) {
            return null;
        }
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
    }

    return (
        <div>
            <h3 className="mb-4 title">{getProductId !== undefined ? "Edit " : "Add "}Product</h3>
            <div>
                <form
                    onSubmit={formik.handleSubmit}
                    className="d-flex gap-3 flex-column"
                >
                    <CustomInput
                        type="text"
                        label="Enter Product Title"
                        name="title"
                        onChng={formik.handleChange}
                        onBlr={formik.handleBlur}
                        val={formik.values.title}
                    />
                    <div className="error">
                        {formik.touched.title && formik.errors.title}
                    </div>
                    <div className="">
                        <ReactQuill
                            theme="snow"
                            name="description"
                            onChange={formik.handleChange("description")}
                            value={formik.values.description}

                        />
                    </div>
                    <div className="error">
                        {formik.touched.description && formik.errors.description}
                    </div>
                    <CustomInput
                        type="number"
                        label="Enter Product Price"
                        name="price"
                        onChng={formik.handleChange("price")}
                        onBlr={formik.handleBlur("price")}
                        val={formik.values.price}

                    />
                    <div className="error">
                        {formik.touched.price && formik.errors.price}
                    </div>
                    <select
                        name="brand"
                        onChange={formik.handleChange("brand")}
                        onBlur={formik.handleBlur("brand")}
                        value={formik.values.brand}
                        className="form-control py-3 mb-3"
                        id=""
                    >
                        <option value="">Select Brand</option>
                        {brandState.map((i, j) => {
                            return (
                                <option key={j} value={i.title}>
                                    {i.title}
                                </option>
                            );
                        })}
                    </select>
                    <div className="error">
                        {formik.touched.brand && formik.errors.brand}
                    </div>
                    <select
                        name="category"
                        onChange={formik.handleChange("category")}
                        onBlur={formik.handleBlur("category")}
                        value={formik.values.category}
                        className="form-control py-3 mb-3"
                        id=""
                    >
                        <option value="">Select Category</option>
                        {cartState.map((i, j) => {
                            return (
                                <option key={j} value={i.title}>
                                    {i.title}
                                </option>
                            );
                        })}
                    </select>
                    <div className="error">
                        {formik.touched.category && formik.errors.category}
                    </div>
                    <select
                        name="tags"
                        onChange={formik.handleChange("tags")}
                        onBlur={formik.handleBlur("tags")}
                        value={formik.values.tags}
                        className="form-control py-3 mb-3"
                        id=""
                    >
                        <option value="" disabled>
                            Select Tags
                        </option>
                        <option value="featured">Featured</option>
                        <option value="popular">Recommended</option>
                    </select>
                    <div className="error">
                        {formik.touched.tags && formik.errors.tags}
                    </div>

                    <Select
                        mode="multiple"
                        allowClear
                        className="w-100"
                        placeholder="Select colors"
                        defaultValue={rgbColors}
                        onChange={(i) => handleColors(i)}
                        options={coloropt}
                    />
                    <div className="error">
                        {formik.touched.color && formik.errors.color}
                    </div>
                    <CustomInput
                        type="number"
                        label="Enter Product Quantity"
                        name="quantity"
                        onChng={formik.handleChange("quantity")}
                        onBlr={formik.handleBlur("quantity")}
                        val={formik.values.quantity}
                    />
                    <div className="error">
                        {formik.touched.quantity && formik.errors.quantity}
                    </div>
                    <div className="bg-white border-1 p-5 text-center">
                        <Dropzone
                            onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
                        >
                            {({ getRootProps, getInputProps }) => (
                                <section>
                                    <div {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <p>
                                            Drag 'n' drop some files here, or click to select files
                                        </p>
                                    </div>
                                </section>
                            )}
                        </Dropzone>

                    </div>
                    <div className="showimages d-flex flex-wrap gap-3">
                        {imgState?.map((i, j) => {
                            return (
                                <div className=" position-relative" key={j}>
                                    <button
                                        type="button"
                                        onClick={() => dispatch(delImg(i.public_id))}
                                        className="btn-close position-absolute"
                                        style={{ top: "10px", right: "10px" }}
                                    ></button>
                                    <img src={i.url} alt="" width={200} />
                                </div>
                            );
                        })}
                    </div>
                    <button
                        className="btn btn-success border-0 rounded-3 my-5"
                        type="submit"
                    >
                        {getProductId !== undefined ? "Edit" : "Add"} Product
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Addproduct;





