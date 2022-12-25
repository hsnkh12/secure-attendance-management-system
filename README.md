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