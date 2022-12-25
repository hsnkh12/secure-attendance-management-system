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
- date and time
- is present



------



## Routes 




/ 
- GET: index page 

/teachers?department_id=
- GET: get all teachers 
- POST: add a new teacher 

/teachers/{teacherID}
- PUT: update teacher information
- DELETE: remove a teacher

/students?department_id
- GET: get all students
- POST: add a new student

/students/{studentID}
- PUT: update student information
- DELETE: remove a student

/parents/