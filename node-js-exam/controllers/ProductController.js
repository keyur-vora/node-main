const Category = require('../models/CategoryModel');
const Subcategory = require('../models/SubcategoryModel');
const Exsubcategory = require('../models/ExsubcategoryModel');
const Product = require('../models/ProductModel');
const fs = require('fs');
const path = require('path');

// View Products
const viewProduct = async (req, res) => {
    try {
        const product = await Product.find()
            .populate('categoryId', 'category')
            .populate('subcategoryId', 'subcategory')
            .populate('exsubcategoryId', 'exsubcategory');

        return res.render('product/view_product', { product });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

// Add Product Page
const addProduct = async (req, res) => {
    try {
        const category = await Category.find({ status: 'active' });
        const subcategory = await Subcategory.find({ status: 'active' });
        const exsubcategory = await Exsubcategory.find({ status: 'active' });

        return res.render('product/add_product', {
            category,
            subcategory,
            exsubcategory
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

// Insert Product
const insertProduct = async (req, res) => {
    try {
        const { category, subcategory, exsubcategory, product, price, description, quantity } = req.body;

        await Product.create({
            categoryId: category,
            subcategoryId: subcategory,
            exsubcategoryId: exsubcategory,
            product,
            price,
            quantity,  // ✅ Fixed undefined qty issue
            description,
            image: req.file ? req.file.path : ''
        });

        req.flash('success', "Product successfully added");
        return res.redirect('/product');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

// Get Subcategories based on Category (AJAX)
const ajaxcategorywiseRecord = async (req, res) => {
    try {
        const subcategoryid = req.query.subcategoryId;
        const exsubcategorydeta = await Exsubcategory.find({ subcategoryId: subcategoryid, status: 'active' })
            .populate('categoryId')
            .populate('subcategoryId');

        return res.status(200).send({
            status: true,
            message: "Record Found",
            exsubcategory: exsubcategorydeta
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const id = req.query.id;
        await Product.findByIdAndDelete(id);

        req.flash('delete', "Product successfully deleted");
        return res.redirect('/product');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

// Edit Product Page
const editeProduct = async (req, res) => {
    try {
        const id = req.query.id;
        const singleproduct = await Product.findById(id)
            .populate('categoryId')
            .populate('subcategoryId')
            .populate('exsubcategoryId');

        const category = await Category.find({ status: 'active' });
        const subcategory = await Subcategory.find({ status: 'active' });
        const exsubcategory = await Exsubcategory.find({ status: 'active' });

        return res.render('product/edit_product', {
            category,
            subcategory,
            exsubcategory,
            single: singleproduct
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

// Change Product Status (Active/Inactive)
const changeStatus = async (req, res) => {
    try {
        const { id, status } = req.query;

        const newStatus = status === 'active' ? 'active' : 'deactive';
        await Product.findByIdAndUpdate(id, { status: newStatus });

        req.flash('success', "Product status successfully updated");
        return res.redirect('/product');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { editid, category, subcategory, exsubcategory, product, price, description, quantity } = req.body;

        // Find the existing product
        const existingProduct = await Product.findById(editid);
        if (!existingProduct) {
            req.flash('error', "Product not found");
            return res.redirect('/product');
        }

        // Check if a new image is uploaded
        const updatedImage = req.file ? req.file.path : existingProduct.image;

        await Product.findByIdAndUpdate(editid, {
            categoryId: category,
            subcategoryId: subcategory,
            exsubcategoryId: exsubcategory,
            product,
            price,
            quantity,  // ✅ Added quantity update
            description,
            image: updatedImage
        });

        req.flash('success', "Product successfully updated!");
        return res.redirect('/product');
    } catch (err) {
        console.error(err);
        return res.status(500).send("Server Error");
    }
};

// Exporting all functions
module.exports = {
    viewProduct,
    addProduct,
    insertProduct,
    ajaxcategorywiseRecord,
    changeStatus,
    deleteProduct,
    editeProduct,
    updateProduct
};
