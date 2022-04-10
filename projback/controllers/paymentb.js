const braintree = require("braintree");

var gateway = new braintree.BraintreeGateway({
    environment:  braintree.Environment.Sandbox,
    merchantId:   'fmzwcb59ccvshvcm',
    publicKey:    '8b6gd36ksk2t9j96',
    privateKey:   'b05d8600eee377b8ad0d1851b1d06815'
});


exports.getToken = (req,res) => {
    gateway.clientToken.generate({}, function(err, response) {
        if(err){
            res.status(500).send(err)
        } else {
            res.send(response);
        }
      });
}

exports.processPayment = (req,res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce

    let amountFromTheClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, function (err, result) {
        if(err){
            res.status(500).json(err)
        } else {
            res.json(result);
        }
      });
}