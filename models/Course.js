const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: [true, 'Please add a course description']
    },
    weeks: {
        type: Number,
        required: [true, 'Please add number of weeks']
    },
    tuition: {
        type: Number,
        required: [true, 'Pleae add tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

courseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([
        { $match: { bootcamp: bootcampId } },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ]);

    try {
        const averageCost = Math.ceil(obj[0].averageCost);
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost
        });
    } catch (error) {
        console.log(error);
    }
};

courseSchema.post('save', async function () {
    await this.constructor.getAverageCost(this.bootcamp);
});

courseSchema.pre('remove', async function () {
    await this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', courseSchema);
