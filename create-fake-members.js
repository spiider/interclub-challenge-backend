const faker = require('faker');
const mongoose = require('mongoose');

const MemberModel = require('./models/member');

const amountMembers = 10;
const memberPromises = [];

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/interclub-challenge', { useMongoClient: true });

console.log('Creating fake members...');

MemberModel.remove({})
    .then(() => {
        for(let i = 0; i < amountMembers; i++) {
            memberPromises.push(createFakeMember(i));
        }

        return Promise.all(memberPromises)
    })
    .then(results => {
        console.log(`Created ${results.length} fake members`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    })

function createFakeMember(iterator) {
    return new MemberModel({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        number: iterator + 1
    }).save();
}
