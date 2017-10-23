const HttpStatus = require('http-status-codes');
const express = require('express')
const router = express.Router()

const MemberModel = require('../../models/member');
const isNumeric = (n) => !isNaN(parseFloat(n)) && isFinite(n);

router.get('/aye', (req, res) => {
    res.send('aye aye');
});

router.get('/search', (req, res) => {
  // this need be improved
  if (!req.query.s || req.query.s.length < 1) {
    return res.status(HttpStatus.OK).send('Require search parameter');
  }

  if (isNumeric(req.query.s)) {
    MemberModel
        .find({ number: req.query.s })
        .sort({number: 1})
        .then(members => {
            const mappedMembers = members.map(member => {
                return {
                    id: member._id,
                    name: `${member.first_name} ${member.last_name}`,
                    number: member.number
                };
            });
            res.json(mappedMembers);
        })
        .catch(err => {
            res.status(HttpStatus.NOT_FOUND).send('Error');
        })
  } else {
    MemberModel
      .aggregate([
        { $project: { 'name' : { $concat : [ '$first_name',  ' ', '$last_name' ] }, 'number': '$number' }},
        { $match: { 'name': { '$regex': `^${req.query.s}`, '$options': 'i' }}},
      ])
      .sort('name')
      .exec((err, members) => {
          if (err) return res.status(HttpStatus.NOT_FOUND).send('error');
          const mappedMembers = members.map(member => {
            console.dir(member)
              return {
                  id: member._id,
                  name: member.name,
                  number: member.number
              };
          });
          res.json(mappedMembers);
        });
  }
});

router.get('/list-members', (req, res) => {
    MemberModel
        .find({})
        .sort({number: 1})
        .then(members => {
            const mappedMembers = members.map(member => {
                return {
                    id: member._id,
                    first_name: member.first_name,
                    last_name: member.last_name,
                    number: member.number
                };
            });
            res.json(mappedMembers);
        })
        .catch(err => {
            res.status(HttpStatus.NOT_FOUND).send('Error');
        })

});

module.exports = router;
