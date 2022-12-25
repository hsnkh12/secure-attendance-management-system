## Database

USER
- user id
- first name
- last name
- email
- password
- role 
- date joined 
- last login 
- date of birth 

STUDENT
- student id
- current credits 
- past credits
- CGPA
- GPA
- department - foreign key

TEACHER 
- employee id
- department - foreign key

PARENT
- student id
- name

ADMIN
- employee id

DEPARTMENT 
- department id
- name

COURSE
- course code
- name 
- depaartment - foreign key

OFFERED COURSE
- offered course id
- course - foriegn key
- semister 
- teacher - foreign key
- group number

STUDENT HAS COURSE 
- student - foreign key
- offered course - foreign key 

ATTENDANCE 
- offered course - foreign key
- student - foreign key
- date
- is present



------



## Routes 




/ 
- GET: index page (all)

/login/
- POST: login (admin, chair, teacher)

/teachers?department_id=
- GET: get all teachers (admin, chair(only his department), teacher)
- POST: add a new teacher (admin, chair)

/teachers/{teacherID}
- GET: get teacher profile (admin, chair, teacher)
- PUT: update teacher information (admin, chair)
- DELETE: remove a teacher (admin, chair)

/students?department_id=
- GET: get all students (admin, chair, teacher)
- POST: add a new student (admin)

/students/{studentID}
- GET: get student profile (admin, chair, teacher, student)
- PUT: update student information (admin, student)
- DELETE: remove a student (admin)

/parents/
- POST: add new parent (admin)

/parents/{parentID}
- GET: get parent profile (admin, chair, teacher)
- PUT: update parent information (admin)
- DELETE: remove a parent (admin)

/departments/
- GET: get all departments (admin, chair, teacher, students)
- POST: add a new department (admin)

/departments/{deprtmentID}
- GET: get department profile (admin, chair, teacher, students)
- PUT: update department information (admin)
- DELETE: remove a department (admin)

/courses?department_id=
- GET: get all courses (admin, chair, teacher, students)
- POST: add a new course (admin)

/courses/{courseID}
- GET: get course profile (admin, chair, teacher, students)
- PUT: update course information (admin)
- DELETE: remove a course (admin)

/offered-courses?course_id=&semester=&teacher=&group_number=
- GET: get all offered courses (admin, chair, teacher)
- POST: add a new offered course (admin)

/offered-courses/{offered_courseID}
- GET: get course profile (admin, chair, teacher)
- PUT: update course information (admin)
- DELETE: remove a course (admin)

/attendance/{offered_courseID}/&student=&date=
- GET: get all attendance (teacher)
- POST: add a new attendance (teacher)
- PUT: update attendance information (teacher)
- DELETE: remove attendance (teacher)