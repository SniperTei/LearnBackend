const alcoholTypeService = require('../service/alcoholTypeService');

const alcoholTypeList = async (req, res) => {
  alcoholTypeService.queryAlcoholTypeList(req.query).then(result => {
    res.json({
      code: '000000',
      msg: result.msg,
      data: result.data
    });
  }).catch(err => {
    res.json({
      code: '100001',
      msg: err.message,
    });
  });
}

const alcoholTypeAdd = async (req, res) => {
  alcoholTypeService.addAlcoholTypes(req.body).then(result => {
    res.json({
      code: '000000',
      msg: result.msg,
    });
  }).catch(err => {
    res.json({
      code: '100001',
      msg: err.message,
    });
  });
}

module.exports = {
  alcoholTypeList,
  alcoholTypeAdd,
};