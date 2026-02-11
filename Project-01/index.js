
const express = require('express');
const app = express();
const PORT = 3000;

const fs = require('fs');
app.use(express.json());

const students = require('./MOCK-DATA.json');

//get all students
app.get('/', (req, res) => {
    res.json(students);
});


//get student by id 
app.get('/student/:id', (req, res) => {
    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);
    res.setHeader('X-Custom-Name', 'get student by id');
    res.json(student);
})

//add student
app.post('/student/add', (req, res) => {
    const newStudent = req.body;
    students.push(newStudent);
    
    fs.writeFile('./MOCK-DATA.json', JSON.stringify(students, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error saving student data' });
        }
        res.setHeader('X-Custom-Name', 'add student');
        res.status(201).json({ message: 'Student added successfully', student: newStudent });
    });
})

//patch student 
app.patch('/student/:id', (req, res) => {
    const id = Number(req.params.id);
    const student = students.find(s => s.id === id);
    if(student){
        Object.assign(student,req.body);
        fs.writeFile('./MOCK-DATA.json', JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error updating student data' });
            }
            res.json({ message: 'Student updated successfully', student: student });
        });
    }
});

//delete student 
app.delete('/student/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
        const deletedStudent = students.splice(index, 1)[0];
        fs.writeFile('./MOCK-DATA.json', JSON.stringify(students, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting student data' });
            }
            res.json({ message: 'Student deleted successfully', student: deletedStudent });
        });
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});