import { useEffect, useMemo, useState } from 'react';

const emptyForm = {
  name: '',
  course: '',
  marks: '',
};

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const filteredStudents = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return students;

    return students.filter((student) =>
      [student.name, student.course, String(student.marks)]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
  }, [query, students]);

  const averageMarks = useMemo(() => {
    if (!students.length) return 0;
    const total = students.reduce((sum, student) => sum + Number(student.marks || 0), 0);
    return Math.round(total / students.length);
  }, [students]);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/students');
      if (!response.ok) throw new Error('Unable to load students.');
      const data = await response.json();
      setStudents(data);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    const payload = {
      name: form.name.trim(),
      course: form.course.trim(),
      marks: Number(form.marks),
    };

    const endpoint = editingId ? `/students/edit/${editingId}` : '/students/add';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Unable to save student.');

      setMessage(editingId ? 'Student updated successfully.' : 'Student added successfully.');
      resetForm();
      await fetchStudents();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setForm({
      name: student.name ?? '',
      course: student.course ?? '',
      marks: String(student.marks ?? ''),
    });
    setMessage('');
    setError('');
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm(`Delete ${student.name}?`);
    if (!confirmed) return;

    setMessage('');
    setError('');

    try {
      const response = await fetch(`/students/${student.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Unable to delete student.');
      setMessage('Student deleted successfully.');
      await fetchStudents();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <main className="app-shell">
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top">
        <div className="container-fluid px-4">
          <span className="navbar-brand fw-bold">Student Management</span>
          <div className="d-flex align-items-center gap-3 small text-secondary">
            <span>{students.length} students</span>
            <span>Average {averageMarks}%</span>
          </div>
        </div>
      </nav>

      <section className="container-fluid px-4 py-4">
        <div className="row g-4">
          <div className="col-12 col-xl-4">
            <div className="panel">
              <div className="panel-header">
                <h1>{editingId ? 'Edit Student' : 'Add Student'}</h1>
                <p>Keep student records current across courses and marks.</p>
              </div>

              <form onSubmit={handleSubmit} className="vstack gap-3">
                <div>
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    id="name"
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Student name"
                  />
                </div>

                <div>
                  <label htmlFor="course" className="form-label">Course</label>
                  <input
                    id="course"
                    name="course"
                    className="form-control"
                    value={form.course}
                    onChange={handleChange}
                    required
                    placeholder="Course name"
                  />
                </div>

                <div>
                  <label htmlFor="marks" className="form-label">Marks</label>
                  <input
                    id="marks"
                    name="marks"
                    className="form-control"
                    type="number"
                    min="0"
                    max="100"
                    value={form.marks}
                    onChange={handleChange}
                    required
                    placeholder="0-100"
                  />
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-primary flex-grow-1" type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editingId ? 'Update Student' : 'Add Student'}
                  </button>
                  {editingId && (
                    <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="col-12 col-xl-8">
            <div className="panel">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 panel-toolbar">
                <div>
                  <h2>Student Records</h2>
                  <p>Search, edit, and remove students from the current database.</p>
                </div>
                <div className="search-box">
                  <input
                    className="form-control"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search students"
                  />
                </div>
              </div>

              {message && <div className="alert alert-success py-2">{message}</div>}
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Course</th>
                      <th>Marks</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="4" className="text-center text-secondary py-5">Loading students...</td>
                      </tr>
                    ) : filteredStudents.length ? (
                      filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="fw-semibold">{student.name}</td>
                          <td>{student.course}</td>
                          <td>
                            <span className="badge text-bg-light border">{student.marks}%</span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-primary" onClick={() => handleEdit(student)}>
                                Edit
                              </button>
                              <button className="btn btn-outline-danger" onClick={() => handleDelete(student)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center text-secondary py-5">No students found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
