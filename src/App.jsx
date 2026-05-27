import './App.css'
import {useState,useEffect /* for 3rd party api keys */} from 'react'
import axios from 'axios'

const API_URL = "http://localhost:8086/students";

function App() {
  // Store data coming  from SpringBoot API
  const[students,setStudents] = useState([]);

  //Form input states
  const [name,setName] = useState("");
  const [course,setCourse] = useState("");
  const [marks,setMarks] = useState("");

  //Editing Student
  const [editId,setEditId] = useState(null);

  //Read: GET all students from SpringBoot API
  async function fetchStudents(){
    const response = await axios.get(API_URL);
      setStudents(response.data);
  }

  // Run automatically when the component loads
  useEffect(()=>{
    axios.get(API_URL).then((response) => {
      setStudents(response.data);
    });
  },[])

  //Clear input boxes
  const resetForm = ()=>{
    //make input empty
    setName("");
    setCourse("");
    setMarks("");
    setEditId(null);
  }

  // CREATE or UPDATE
  
  

  const saveStudent = async(e)=>{
    e.preventDefault();
    if(!name || !course || !marks || marks < 0 || marks > 100){
      alert("Please fill all fields");
      return;
    }
    const student = {
      name : name,
      course : course,
      marks : Number(marks),
    };


    if(editId == null){
      //create == Send POST request to SpringBoot
      await axios.post(`${API_URL}/add`,student);
    }

    else{
      //update == Send PUT request to SpringBoot
      await axios.put(`${API_URL}/${editId}`,student);
    }

    // FETCH latest data from backend
    fetchStudents();

    // Clear form
    resetForm();

  }

  
  const editStudent = (student)=>{
    //Fill form with selected student data
    setName(student.name);
    setCourse(student.course);
    setMarks(student.marks);
    setEditId(student.id);
    }
  
  
  const deleteStudent=async(id)=>{
      //keep all students except the one with the given id
      const confirmDelete = window.confirm("Are you sure you want to delete?");
      if(!confirmDelete) return;
      const response = await axios.delete(`${API_URL}/${id}`);
      alert(response.data);
      fetchStudents();
    }

  const averageMarks = students.length
    ? Math.round(students.reduce((total, student) => total + Number(student.marks), 0) / students.length)
    : 0;
  const highestMarks = students.length
    ? Math.max(...students.map((student) => Number(student.marks)))
    : 0;

  //... -> spread operator
    return (
    
      <main className="student-management">
        <div className="dashboard-shell">
          <aside className="dashboard-rail" aria-label="Dashboard summary">
            <div className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="rail-points">
              <span className="rail-point rail-point-active" />
              <span className="rail-point" />
              <span className="rail-point" />
              <span className="rail-point" />
            </div>

            <div className="rail-summary">
              <p>Average</p>
              <strong>{averageMarks}%</strong>
              <span>Class score</span>
            </div>
          </aside>

          <div className="dashboard-main">
            <header className="app-header">
              <div className="welcome-copy">
                <p className="eyebrow">Academic dashboard</p>
                <h1>Student Management</h1>
              </div>
              <div className="header-glance">
                <div className="header-pill">
                  <span>Top score</span>
                  <strong>{highestMarks}%</strong>
                </div>
                <div className="student-count" aria-label={`${students.length} students`}>
                  <strong>{students.length}</strong>
                  <span>Students</span>
                </div>
              </div>
            </header>

            <section className="overview-grid" aria-label="Student overview">
              <div className="overview-panel editor-surface">
                <div className="panel-heading">
                  <h2>{editId == null ? "Add Student" : "Update Student"}</h2>
                  <span>{editId == null ? "New record" : "Editing"}</span>
                </div>
                <form className="student-form" onSubmit={saveStudent}>
                  <div className="form-field">
                    <label className="field-label" htmlFor="student-name">Name</label>
                    <input id="student-name" className="field-control" type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required/> 
                  </div>
                  <div className="form-field">
                    <label className="field-label" htmlFor="student-course">Course</label>
                    <input id="student-course" className="field-control" type="text" placeholder="Enter course" value={course} onChange={(e) => setCourse(e.target.value)} required/>
                  </div>
                  <div className="form-field marks-field">
                    <label className="field-label" htmlFor="student-marks">Marks</label>
                    <input id="student-marks" className="field-control" type="number" placeholder="0-100" value={marks} onChange={(e) => setMarks(e.target.value)} min="0" max="100" required/>
                  </div>
                  <div className="form-actions">
                    <div className="editor-actions">
                      <button className="action-button primary-action" type="submit">{editId == null ? "Add" : "Update"}</button>
                      {editId !== null &&(
                        <button className="action-button secondary-action" onClick={resetForm} type="button">Cancel</button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              <div className="overview-stats">
                <div className="metric-card">
                  <span>Total students</span>
                  <strong>{students.length}</strong>
                </div>
                <div className="metric-card metric-card-accent">
                  <span>Average marks</span>
                  <strong>{averageMarks}%</strong>
                </div>
              </div>
            </section>

            <section className="records-section" aria-labelledby="student-list-title">
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Records</p>
                  <h2 id="student-list-title">Active Students</h2>
                </div>
              </div>
              
              <div className="student-grid">
                {students.map((student)=>(
                  <div className="student-grid-item" key={student.id}>
                    <article className="student-card">
                      <div className="student-banner">
                        <div className="student-avatar" aria-hidden="true">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="course-tag">{student.course}</span>
                      </div>
                      <div className="student-card-body">
                        <div className="student-card-heading">
                          <div>
                            <p>Student</p>
                            <h3 className="student-card-title">{student.name}</h3>
                          </div>
                          <span className="marks-chip">{student.marks}%</span>
                        </div>
                        <div className="score-row">
                          <span>Marks progress</span>
                          <strong>{student.marks}/100</strong>
                        </div>
                        <div className="student-progress" role="progressbar" aria-label={`${student.name} marks`} aria-valuenow={student.marks} aria-valuemin="0" aria-valuemax="100">
                          <div className="student-progress-bar" style={{ width: `${student.marks}%` }} />
                        </div>
                        <div className="card-actions">
                          <button className="action-button edit-action" onClick={()=>editStudent(student)}>Edit</button> 
                          <button className="action-button delete-action" onClick={()=>deleteStudent(student.id)}>Delete</button>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {students.length === 0 &&(
                <div className="empty-state">No student records yet.</div>
              )}
            </section>
          </div>
        </div>
      </main>
    )
}

export default App
