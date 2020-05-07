
INSERT INTO department (department_name) VALUES ('A');
INSERT INTO department (department_name) VALUES ('B');
INSERT INTO department (department_name) VALUES ('C');

INSERT INTO _role (title, salary, department_id) VALUES ('Manager',120,1);
INSERT INTO _role (title, salary, department_id) VALUES ('Engineer',100,1);
INSERT INTO _role (title, salary, department_id) VALUES ('Student',50,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Elon','Musk',2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Kobe','Bryant',1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Francisco','Camacho',3, null);