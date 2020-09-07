const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('colors');

// Load env vars
dotenv.config({ path: './config/config.env' });

const Bootcamp = require('./models/Bootcamp');

// Connect database
mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);

        console.log('Data imported'.green.inverse);

        process.exit();
    } catch (error) {
        console.log(error);
    }
};

const destroyData = async () => {
    try {
        await Bootcamp.deleteMany();

        console.log('Data destroyed'.red.inverse);

        process.exit();
    } catch (error) {
        console.log(error);
    }
};

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    destroyData();
}