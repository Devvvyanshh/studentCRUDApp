package org.example.studentmanagementapp.controller;

import org.example.studentmanagementapp.entity.Student;
import org.example.studentmanagementapp.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
@CrossOrigin(origins="http://localhost:5173/")
public class StudentData {

    private final StudentRepository studentRepository;

    public StudentData(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public List<Student> getAllStudents(){
        return studentRepository.findAll();
    }

    @PostMapping("/add")
    public Student addStudent(@RequestBody Student student){
        return studentRepository.save(student);
    }

    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id){
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found id : " +id));
        studentRepository.deleteById(id);
        return existingStudent.getName() + " has been deleted";
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id,@RequestBody Student student){
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found id : " +id));
        existingStudent.setId(id);
        existingStudent.setName(student.getName());
        existingStudent.setCourse(student.getCourse());
        existingStudent.setMarks(student.getMarks());
        return studentRepository.save(existingStudent);
    }
}
