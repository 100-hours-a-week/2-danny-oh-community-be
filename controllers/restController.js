// controllers/userController.js
const post_ = (req, res) => {
    res.status(201).json({
        status: 201,
        message: 'POST',
        data: req.body
    });
};

const put_ = (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'PUT',
        data: req.body
  });
};

const patch_ = (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'PATCH',
        data: req.body
  });

};

const delete_ = (req, res) => {
    res.status(204).json({
        status: 204,
        message: 'DELETE',
        data: null
  });
};
  

module.exports = { post_, put_, patch_, delete_ };