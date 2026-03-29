const Queue = require('../models/Queue');

exports.updateSettings = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, maxCapacity, serviceRate } = req.body;

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity;
        if (serviceRate !== undefined) updateData.serviceRate = serviceRate;

        const updatedQueue = await Queue.findByIdAndUpdate(
            id,
            updateData,
            { returnDocument: 'after' }
        );

        if (!updatedQueue) {
            return res.status(404).json({ error: "Queue not found" });
        }

        res.status(200).json({
            message: "Queue updated successfully",
            data: updatedQueue
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};