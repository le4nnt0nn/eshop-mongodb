const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

/* use .select('name image -_id'); 
for display only name, image and not id */
router.get(`/`, async (req, res)=>{
    const productList = await Product.find().populate('category');
    if(!productList) {
        res.status(500).json({success : false})
    }
    res.send(productList);
})

/* populate shows category fields on get */
router.get(`/:id`, async (req, res)=>{
    const product = await Product.findById(req.params.id).populate('category');
    if(!product) {
        res.status(500).json({success : false})
    }
    res.send(product);
})

router.post(`/`, async (req, res)=>{
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })

    product = await product.save();

    if(!product)
    return res.status(500).send('The product cannot be created')

    res.send(product);
})

router.put('/:id', async (req, res)=>{
    if(!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product Id')
    }
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        },
        { new: true }
    )

    if(!product)
    return res.status(404).send('the product cannot be updated!')

    res.send(product);
})

router.delete('/:id', (req, res)=>{
    Product.findByIdAndRemove(req.params.id).then(product =>{
        if(product) {
            return res.status(200).json({success: true, message: 'the product is deleted!'})
        } else {
            return res.status(404).json({success : false, message:'product not found!'})
        }
    }).catch(err=>{
        return res.status(400).json({success: false, error: err})
    })
})

/* 
Permite contar el numero de productos (en este caso) de la tabla. No funciona

router.get(`/get/count`, async (req, res)=>{
    const productCount = await Product.countDocuments((count) => count)
    
    if(!productCount) {
        res.status(500).json({success : false})
    }
    res.send(productCount);
})
 */

// exporta el modulo router
module.exports = router;