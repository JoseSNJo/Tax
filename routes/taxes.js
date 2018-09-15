var express = require('express');
var router = express.Router();
var models = require('../models');
var auth_check = require('../middleware/auth_check');

router.get('/', function (req, res, next) {
    var take = req.query.take;
    var skip = req.query.skip;
    var is_object = req.query.is_object
    var query = {};

    if (take && skip) {
        query.offset = parseInt(skip);
        query.limit = parseInt(take);
    }

    var clients_id = res.locals.user.clients_id;
    query.where = {
        clients_id: clients_id,
        parent_id: 0
    }
    query.include = {
        model: models.tax,
        as: 'taxes',
        parent_id: 0
    }

    models.tax.findAndCountAll(
            query
        )
        .then(success => {
            if (is_object == 1 || is_object == '1') {
                res.json({
                    message: 'Data Listed Successfully',
                    length: success.count,
                    data: {
                        taxes: success.rows
                    }
                })
            } else {
                res.json({
                    message: 'Data Listed Successfully',
                    length: success.count,
                    data: success.rows
                })
            }
        })
        .catch(error => {
            res.status(403).json({
                message: 'Something Went Wrong',
                data: error
            })
        })
});



router.post('/', function (req, res, next) {

    var data = req.body;
    data.clients_id = res.locals.user.clients_id;

    var taxes = models.tax.build(data);
    taxes.save()
        .then(success => {
            if (data.taxes != null) {
                for (const key in data.taxes) {
                    if (data.taxes.hasOwnProperty(key)) {
                        data.taxes[key].parent_id = success.dataValues.id;
                        data.taxes[key].clients_id = res.locals.user.clients_id;
                        data.taxes[key].countries_id = success.dataValues.countries_id;
                    }
                }
                save_taxes(data.taxes).then(value => {
                    var response = success.dataValues
                    response.taxes = value
                    res.json({
                        status: 'success',
                        message: 'Data Saved Successfully',
                        data: response
                    })
                }).catch(err => {
                    res.status(403).json({
                        message: 'Something Went Wrong',
                        data: err
                    })
                })
            } else {
                res.json({
                    status: 'success',
                    message: 'Data Saved Successfully',
                    data: success
                })
            }
        }).catch(error => {
            res.status(403).json({
                message: 'Something Went Wrong',
                data: error
            })
        })
});

var save_taxes = function (data) {
    return new Promise((resolve, reject) => {
        models.tax.bulkCreate(data, {
            individualHooks: true
        }).then(success => {
            resolve(success);
        }).catch(err => {
            reject(err);
        })
    })
}

router.put('/:id', function (req, res, next) {

    var id = req.params.id;
    var data = req.body;

    delete data.value; // You can't edit value of tax.if change value of tax it will affected to existing bills
    delete data.id;
    delete data.created_at;
    delete data.updated_at;

    models.tax.update(data, {
            where: {
                id: id
            }
        })
        .then(success => {
            res.json({
                status: 'success',
                message: 'Data Updated Successfully',
                data: success
            })
        }).catch(error => {
            res.status(403).json({
                status: 'error',
                message: 'Something Went Wrong',
                data: error
            })
        })
});

router.delete('/:id', function (req, res, next) {
    var id = req.params.id;
    models.tax.destroy({
            where: {
                id: id
            }
        })
        .then(success => {
            res.json({
                status: 'success',
                message: 'Data Deleted Successfully',
                data: success
            })
        }).catch(error => {
            res.status(403).json({
                status: 'error',
                message: 'Something Went Wrong',
                data: error
            })
        });
});

module.exports = router;