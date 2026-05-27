package org.example.studentmanagementapp.repository;

import org.example.studentmanagementapp.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student,Long> {
}
