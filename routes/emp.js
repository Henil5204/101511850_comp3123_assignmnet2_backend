const express = require('express');
const Employee = require('../models/Employee');


const router = express.Router();


/* Employee List */
router.get('/employees', async (req, res) => {

    try {

        const employees = await Employee.find();
        res.json(employees);
    } 
    
    catch (err) {

        res.status(500).json({ error: err.message });
    }
});


/* Get Employee By ID */
router.get('/employees/:id', async (req, res) => {

    const { id } = req.params;

    try {

        const employee = await Employee.findById(id);

        if (!employee)
            return res.status(404).json({ error: `Employee with ID: ${id} not found` });

        res.json(employee);
    } 
    
    catch (err) {

        res.status(500).json({ error: err.message });
    }
});


/* Create Employee */
router.post('/employees', async (req, res) => {

    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

    if (!first_name || !last_name || !email || !date_of_joining)
        return res.status(400).json({ error: 'All fields are required' });

    try {

        const existingEmployee = await Employee.findOne({ 
            $or: [{ email }] 
        });

        if (existingEmployee)
            return res.status(400).json({ error: `Employee with email ${email} already exists` });
        
        const newEmployee = new Employee({
            first_name, last_name, email, position, salary, date_of_joining, department
        });

        await newEmployee.save();

        res.status(201).json({
            status: true,
            message: 'Employee successfully created',
            newEmployee
        });
    } 
    
    catch (err) {

        res.status(500).json({ error: err.message });
    }
});


/* Update Employee */
router.put('/employees/:id', async (req, res) => {

    const { id } = req.params;
    const updates = req.body;

    try {

        const updatedEmployee = await Employee.findByIdAndUpdate(
            id, 
            { ...updates, updated_at: Date.now() }, 
            { new: true, runValidators: true }
        );

        if (!updatedEmployee)
            return res.status(404).json({ error: `Employee with ID: ${id} not found` });

        res.json({
            status: true,
            message: 'Employee successfully updated',
            updatedEmployee
        });
    } 
    
    catch (err) {

        res.status(500).json({ error: err.message });
    }
})


/* Delete Employee */
router.delete('/employees/:id', async (req, res) => {

    const { id } = req.params;

    try {

        const deletedEmployee = await Employee.findByIdAndDelete(id);

        if (!deletedEmployee)
            return res.status(404).json({ error: `Employee with ID: ${id} not found` });

        res.json({
            status: true,
            message: 'Employee successfully deleted',
            deletedEmployee
        });
    } 
    
    catch (err) {

        res.status(500).json({ error: err.message });
    }
});


module.exports = router;