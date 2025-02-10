const CategoryModel = require('../models/CategoryModel');
const SubCategoryModel = require('../models/SubcategoryModel');
const ExSubCategoryModel = require('../models/ExsubcategoryModel');

// View Exsubcategory
const viewexsubCategory = async (req, res) => {
    try {
        let exsubcategory = await ExSubCategoryModel.find({}).populate('categoryId').populate('subcategoryId');
        return res.render('exsubcategory/view_exsubcategory', {
            exsubcategory
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

// Add Exsubcategory
const addexSubCategory = async (req, res) => {
    try {
        let category = await CategoryModel.find({ status: 'active' });
        let subcategory = await SubCategoryModel.find({ status: 'active' });

        return res.render('exsubcategory/add_exsubcategory', {
            category: category,
            subcategory: subcategory
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

// AJAX Category-wise Record
const ajaxCategorywiseRecord = async (req, res) => {
    try {
        let categoryid = req.query.categoryId;
        let subcategorydata = await SubCategoryModel.find({ categoryId: categoryid, status: 'active' }).populate('categoryId');
        return res.status(200).send({
            success: true,
            message: "Record successfully fetched",
            subcategory: subcategorydata
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

// Insert Exsubcategory
const insertExsubcategory = async (req, res) => {
    try {
        const { category, subcategory, exsubcategory } = req.body;
        await ExSubCategoryModel.create({
            categoryId: category,
            subcategoryId: subcategory,
            exsubcategory: exsubcategory
        });
        req.flash('success', "Exsubcategory successfully added");
        return res.redirect('/exsubcategory/addexsubcategory');
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

// Delete Exsubcategory
const deleteExSubcategory = async (req, res) => {
    try {
        let id = req.query.id;
        await ExSubCategoryModel.findByIdAndDelete(id);
        req.flash("success", "Exsubcategory successfully deleted");
        return res.redirect('/exsubcategory');
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

// Edit Exsubcategory
const editExsubcategory = async (req, res) => {
    try {
        let id = req.query.id;
        let categories = await CategoryModel.find({ status: 'active' });
        let single = await ExSubCategoryModel.findById(id).populate('categoryId').populate('subcategoryId');
        return res.render('exsubcategory/edit_exsubcategory', {
            category: categories,
            single: single,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

// Change Status
const changeStatus = async (req, res) => {
    try {
        const { id, status } = req.query;
        if (status === "active") {
            await ExSubCategoryModel.findByIdAndUpdate(id, { status: 'active' });
        } else {
            await ExSubCategoryModel.findByIdAndUpdate(id, { status: 'deactive' });
        }
        req.flash("success", "Subcategory status successfully changed!");
        return res.redirect('/exsubcategory');
    } catch (err) {
        console.log(err);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    viewexsubCategory,
    addexSubCategory,
    ajaxCategorywiseRecord,
    insertExsubcategory,
    deleteExSubcategory,
    changeStatus,
    editExsubcategory,
};